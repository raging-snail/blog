---
author: lavie
pubDatetime: 2025-07-30T09:40:01Z
modDatetime: 2026-01-30T09:32:42Z
title: Java中使用EasyExcel处理表格
featured: false
draft: false
private: false
tags:
  - java
description: 本文分享了一个功能完善的 EasyExcel 工具类，详细展示了如何实现表格的高效读写、自定义样式设置、单元格合并策略以及自适应列宽等高级特性。
---

在企业级后台开发中，Excel 导出是高频需求。虽然 Alibaba 的 EasyExcel 已经极大地简化了读写操作，但在处理复杂样式（如：成绩不及格标红）和动态合并（如：按部门合并单元格）时，往往需要编写大量重复的样板代码。

本文将分享一套封装方案，通过 AOP 切面思想（自定义注解 + 策略拦截器），实现只需在实体类（VO）上加几个注解，即可完成复杂的导出逻辑。

包结构说明，代码组织遵循单一职责原则，将模型、工具、处理器和注解分离：

``` plantext
com.xxx.xxx.config.excel
├── aop
│   ├── ExcelMerge.java           // [注解] 用于定义合并策略
│   ├── ExcelStyle.java           // [注解] 用于定义单元格/行样式
├── model
│   └── ExcelStyleModel.java      // [DTO] 样式配置传输模型
├── utils
│   └── ExcelStyleHelper.java     // [工具类] 解析注解、反射获取值、创建样式对象
├── handler
│   ├── CustomCellStyleHandler.java   // [处理器] 实现 CellWriteHandler，处理单元格级样式
│   ├── CustomRowStyleHandler.java    // [处理器] 实现 RowWriteHandler，处理行级样式
│   ├── CustomCellWidthHandler.java   // [处理器] 实现 AbstractColumnWidthStyleStrategy，处理列宽
│   └── CustomMergeStrategy.java      // [处理器] 实现 AbstractMergeStrategy，处理纵向合并
```

## 一、 核心功能与注解定义
需要定义两个注解：@ExcelStyle 用于控制样式，@ExcelMerge 用于控制合并逻辑。

### 1. 样式注解 @ExcelStyle
该注解不仅支持设置字体、背景色、对齐方式，最核心的是支持 regexp 正则表达式。只有当单元格内容匹配正则时，样式才会生效。

```java file=ExcelStyle.java
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import java.lang.annotation.*;

/**
 * @author yeweiwei
 * @version 1.0
 * @date 2026/1/30
 **/
@Target({ElementType.FIELD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ExcelStyle {
    // 正则表达式：内容匹配时样式才生效
    String regexp() default "";

    String fontName() default "";
    short fontHeightInPoints() default 12;
    // 背景填充色，对应 IndexedColors.RED.index 等
    short fillForegroundColor() default -1;

    HorizontalAlignment horizontalAlignment() default HorizontalAlignment.LEFT;
    VerticalAlignment verticalAlignment() default VerticalAlignment.CENTER;
}
```

### 2. 合并注解 @ExcelMerge
该注解用于解决“一对多”数据的合并显示问题。
+ needMerge: 标记当前列是否需要合并。
+ isPk: 分组依据。即哪些列是主键，程序会扫描这些列，如果相邻行这些列的值相同，则视为同一组数据，进而合并其他标记了 needMerge 的列。

```java file=ExcelMerge.java
import java.lang.annotation.*;

/**
 * 配合 @ExcelStyle(horizontalAlignment = HorizontalAlignment.CENTER) 使用，可以合并居中
 * @author yeweiwei
 * @version 1.0
 * @date 2026/1/30
 **/
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
public @interface ExcelMerge {
    /**
     * 是否需要合并单元格
     */
    boolean needMerge() default false;

    /**
     * 是否是主键，即该字段相同的行合并，如果有多个属性有这个注解，则必须全都一致才合并
     */
    boolean isPk() default false;
}
```

## 二、 核心配置模型与工具类

为了提高性能，避免在每一行导出时都通过反射重复解析注解，我们使用 ExcelStyleHelper 预先解析配置。

### 1. 配置模型 ExcelStyleModel
在 ExcelStyleModel 中，为了保证传输安全或缓存序列化兼容性，将不可序列化的对象（如 Pattern, WriteCellStyle）标记为 transient。

```java file=ExcelStyleModel.java
import com.alibaba.excel.write.metadata.style.WriteCellStyle;
import com.kcidea.oa.config.excel.aop.ExcelStyle;
import lombok.Data;
import java.io.Serializable;
import java.util.regex.Pattern;

/**
 * 样式配置模型
 * @author yeweiwei
 * @version 1.0
 * @date 2026/1/30
 **/
@Data
public class ExcelStyleModel implements Serializable {
    private static final long serialVersionUID = 1L;
    private Integer columnIndex;
    private String regexp;

    /* --------------------------------------------------------------------------
     * transient 字段不参与序列化
     * -------------------------------------------------------------------------- */
    private transient Pattern pattern;
    // 供 CellWriteHandler 使用
    private transient WriteCellStyle writeCellStyle;
    // 供 RowWriteHandler 使用
    private transient ExcelStyle styleAnnotation;
}
```

### 2. 样式解析助手 ExcelStyleHelper
核心逻辑是 parseStyleConfig，它会扫描字段，预编译正则表达式，并创建 WriteCellStyle 对象。
```java file=ExcelStyleHelper.java
import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.metadata.data.WriteCellData;
import com.alibaba.excel.write.metadata.style.WriteCellStyle;
import com.alibaba.excel.write.metadata.style.WriteFont;
import com.kcidea.oa.config.excel.aop.ExcelStyle;
import com.kcidea.oa.config.excel.model.ExcelStyleModel;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.springframework.util.StringUtils;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * @author yeweiwei
 * @version 1.0
 * @date 2026/1/30
 **/
@Slf4j
public class ExcelStyleHelper {
    private ExcelStyleHelper() {}

    /**
     * 解析类上的 @ExcelStyle 注解配置
     */
    public static Map<Integer, ExcelStyleModel> parseStyleConfig(Class<?> clazz) {
        Map<Integer, ExcelStyleModel> map = new HashMap<>();
        Field[] declaredFields = clazz.getDeclaredFields();
        int index = 0;
        for (Field field : declaredFields) {
            if (field.isAnnotationPresent(ExcelProperty.class)) {
                ExcelStyle annotation = field.getAnnotation(ExcelStyle.class);
                if (annotation != null) {
                    ExcelStyleModel model = new ExcelStyleModel();
                    model.setColumnIndex(index);
                    String regexp = annotation.regexp();
                    model.setRegexp(regexp);

                    if (StringUtils.hasText(regexp)) {
                        try {
                            model.setPattern(Pattern.compile(regexp));
                        } catch (Exception e) {
                            log.warn("Regex compile failed: {} on field {}", regexp, field.getName());
                        }
                    }
                    model.setWriteCellStyle(createWriteCellStyle(annotation));
                    model.setStyleAnnotation(annotation);
                    map.put(index, model);
                }
                index++;
            }
        }
        return map;
    }

    public static WriteCellStyle createWriteCellStyle(ExcelStyle annotation) {
        WriteCellStyle writeCellStyle = new WriteCellStyle();
        WriteFont writeFont = new WriteFont();
        writeFont.setFontName(annotation.fontName());
        writeFont.setFontHeightInPoints(annotation.fontHeightInPoints());
        writeCellStyle.setWriteFont(writeFont);

        if (annotation.fillForegroundColor() != -1) {
            writeCellStyle.setFillPatternType(FillPatternType.SOLID_FOREGROUND);
            writeCellStyle.setFillForegroundColor(annotation.fillForegroundColor());
        }
        writeCellStyle.setHorizontalAlignment(annotation.horizontalAlignment());
        writeCellStyle.setVerticalAlignment(annotation.verticalAlignment());
        return writeCellStyle;
    }

    public static String getCellValueAsString(WriteCellData<?> cellData, Cell cell) {
        if (cellData != null && cellData.getType() != null) {
            switch (cellData.getType()) {
                case STRING: return cellData.getStringValue();
                case NUMBER: return String.valueOf(cellData.getNumberValue());
                case BOOLEAN: return String.valueOf(cellData.getBooleanValue());
                default: break;
            }
        }
        return getCellValue(cell);
    }

    public static String getCellValue(Cell cell) {
        if (cell == null) return "";
        return cell.toString();
    }
}
```

## 三、 策略拦截器实现（核心逻辑）
这是实现功能的关键，我们需要分别实现行处理器、单元格处理器、列宽处理器和合并策略。

### 1. 行样式处理器 CustomRowStyleHandler
**逻辑**：在 afterRowDispose 中，检查行中是否有单元格匹配正则。如果匹配，则对该行所有单元格应用样式。

+ 预解析缓存：在构造函数中，通过 ExcelStyleHelper.parseStyleConfig 解析类中的注解，将正则模式（Pattern）预编译并存入 Map，避免运行时重复反射和编译。
+ 正则匹配逻辑：
    + 如果注解中没有配置 regexp，直接应用样式。
    + 如果配置了 regexp，则获取单元格的值（getCellValueAsString），与预编译的 Pattern 进行匹配，匹配成功才应用样式。

**场景**：某一行如果包含特定值（如状态为“废弃”），则整行标灰。

```java file=CustomRowStyleHandler.java
import com.alibaba.excel.write.handler.RowWriteHandler;
import com.alibaba.excel.write.metadata.holder.WriteSheetHolder;
import com.alibaba.excel.write.metadata.holder.WriteTableHolder;
import com.kcidea.oa.config.excel.aop.ExcelStyle;
import com.kcidea.oa.config.excel.helper.ExcelStyleHelper;
import com.kcidea.oa.config.excel.model.ExcelStyleModel;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import java.util.HashMap;
import java.util.Map;

/**
 * @author yeweiwei
 * @version 1.0
 * @date 2026/1/30
 **/
@Slf4j
public class CustomRowStyleHandler implements RowWriteHandler {
    private final Map<Integer, ExcelStyleModel> styleConfigMap;
    // 运行时缓存 (Workbook -> Index -> CellStyle)，避免创建过多 CellStyle 对象
    private final Map<Integer, CellStyle> runtimeCellStyleCache = new HashMap<>();

    public CustomRowStyleHandler(Class<?> clazz) {
        this.styleConfigMap = ExcelStyleHelper.parseStyleConfig(clazz);
    }

    @Override
    public void afterRowDispose(WriteSheetHolder writeSheetHolder, WriteTableHolder writeTableHolder, Row row,
                                Integer relativeRowIndex, Boolean isHead) {
        if (Boolean.TRUE.equals(isHead) || styleConfigMap.isEmpty()) {
            return;
        }
        Workbook workbook = writeSheetHolder.getSheet().getWorkbook();
        try {
            for (int i = 0; i < row.getLastCellNum(); i++) {
                ExcelStyleModel config = styleConfigMap.get(i);
                if (config != null) {
                    boolean match = false;
                    // 1. 无正则：直接认为匹配
                    if (config.getPattern() == null) {
                        match = true;
                    }
                    // 2. 有正则：检查值
                    else {
                        Cell cell = row.getCell(i);
                        String value = ExcelStyleHelper.getCellValue(cell);
                        if (value != null && config.getPattern().matcher(value).matches()) {
                            match = true;
                        }
                    }

                    if (match) {
                        CellStyle cellStyle = getOrCreateCellStyle(workbook, i, config.getStyleAnnotation());
                        // 将该行所有单元格都应用此样式
                        for (int j = 0; j < row.getLastCellNum(); j++) {
                            Cell targetCell = row.getCell(j);
                            if (targetCell != null) {
                                targetCell.setCellStyle(cellStyle);
                            }
                        }
                        break;
                    }
                }
            }
        } catch (Exception e) {
            log.error("设置行样式异常", e);
        }
    }

    private CellStyle getOrCreateCellStyle(Workbook workbook, Integer colIndex, ExcelStyle annotation) {
        if (runtimeCellStyleCache.containsKey(colIndex)) {
            return runtimeCellStyleCache.get(colIndex);
        }
        CellStyle cellStyle = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setFontName(annotation.fontName());
        font.setFontHeightInPoints(annotation.fontHeightInPoints());
        cellStyle.setFont(font);

        if (annotation.fillForegroundColor() != -1) {
            cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            cellStyle.setFillForegroundColor(annotation.fillForegroundColor());
        }
        cellStyle.setAlignment(annotation.horizontalAlignment());
        cellStyle.setVerticalAlignment(annotation.verticalAlignment());
        runtimeCellStyleCache.put(colIndex, cellStyle);
        return cellStyle;
    }
}
```

### 2. 单元格样式处理器 CustomCellStyleHandler
这是更细粒度的控制，针对单个单元格进行正则匹配和样式修改

**逻辑**：在 afterCellDispose 中检测当前单元格内容是否匹配正则。

**场景**：仅将“不及格”的单元格标红，不影响整行。

```java file=CustomCellStyleHandler.java
import com.alibaba.excel.metadata.Head;
import com.alibaba.excel.metadata.data.WriteCellData;
import com.alibaba.excel.write.handler.CellWriteHandler;
import com.alibaba.excel.write.metadata.holder.WriteSheetHolder;
import com.alibaba.excel.write.metadata.holder.WriteTableHolder;
import com.kcidea.oa.config.excel.helper.ExcelStyleHelper;
import com.kcidea.oa.config.excel.model.ExcelStyleModel;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.springframework.util.CollectionUtils;
import java.util.List;
import java.util.Map;

/**
 * @author yeweiwei
 * @version 1.0
 * @date 2026/1/30
 **/
@Slf4j
public class CustomCellStyleHandler implements CellWriteHandler {
    private final Map<Integer, ExcelStyleModel> cellStyleMap;

    public CustomCellStyleHandler(Class<?> clazz) {
        this.cellStyleMap = ExcelStyleHelper.parseStyleConfig(clazz);
    }

    @Override
    public void afterCellDispose(WriteSheetHolder writeSheetHolder, WriteTableHolder writeTableHolder,
                                 List<WriteCellData<?>> cellDataList, Cell cell, Head head,
                                 Integer relativeRowIndex, Boolean isHead) {
        if (Boolean.TRUE.equals(isHead) || CollectionUtils.isEmpty(cellDataList)) {
            return;
        }
        try {
            int columnIndex = cell.getColumnIndex();
            ExcelStyleModel styleModel = cellStyleMap.get(columnIndex);
            if (styleModel != null) {
                WriteCellData<?> writeCellData = cellDataList.get(0);
                // 1. 无正则：直接应用
                if (styleModel.getPattern() == null) {
                    writeCellData.setWriteCellStyle(styleModel.getWriteCellStyle());
                }
                // 2. 有正则：匹配通过后应用
                else {
                    String value = ExcelStyleHelper.getCellValueAsString(writeCellData, cell);
                    if (value != null && styleModel.getPattern().matcher(value).matches()) {
                        writeCellData.setWriteCellStyle(styleModel.getWriteCellStyle());
                    }
                }
            }
        } catch (Exception e) {
            log.error("设置单元格样式异常 Row:{}, Col:{}", relativeRowIndex, cell.getColumnIndex(), e);
        }
    }
}
```

### 3. 自定义合并策略 CustomMergeStrategy
**逻辑**：
+ 分组计算：在初始化时，calculateGroupCounts 方法会遍历数据列表。它通过反射获取所有标记了 @ExcelMerge(isPk = true) 的字段。
+ 逻辑判断：只有当相邻两行的所有 PK 字段值都相等时，才视为同一组。
+ 执行合并：计算出每组的行数（exportFieldGroupCountList）后，在 merge 方法中对标记了 needMerge = true 的列执行 sheet.addMergedRegionUnsafe

**场景**：导出订单明细，相同的“订单号”需要合并，“商品”列不合并。

``` java file=CustomMergeStrategy.java
import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.metadata.Head;
import com.alibaba.excel.write.merge.AbstractMergeStrategy;
import com.kcidea.oa.config.excel.aop.ExcelMerge;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.util.CollectionUtils;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * 自定义合并策略
 * @author yeweiwei
 * @version 1.0
 * @date 2026/1/30
 **/
@Slf4j
public class CustomMergeStrategy extends AbstractMergeStrategy {
    private final List<Integer> exportFieldGroupCountList;
    private final List<Integer> targetColumnIndex = new ArrayList<>();
    private final Class<?> elementType;
    private Integer beginIndex = null;

    public CustomMergeStrategy(List<?> exportDataList, Class<?> elementType) {
        this.elementType = elementType;
        this.exportFieldGroupCountList = calculateGroupCounts(exportDataList);
    }

    @Override
    protected void merge(Sheet sheet, Cell cell, Head head, Integer relativeRowIndex) {
        if (beginIndex == null) beginIndex = cell.getRowIndex();
        if (targetColumnIndex.isEmpty()) initTargetColumnIndices();

        if (cell.getRowIndex() == beginIndex && targetColumnIndex.contains(cell.getColumnIndex())) {
            mergeColumnGroup(sheet, cell.getColumnIndex());
        }
    }

    private void mergeColumnGroup(Sheet sheet, int columnIndex) {
        int currentRow = beginIndex;
        for (Integer count : exportFieldGroupCountList) {
            if (count > 1) {
                CellRangeAddress cellRangeAddress =
                        new CellRangeAddress(currentRow, currentRow + count - 1, columnIndex, columnIndex);
                sheet.addMergedRegionUnsafe(cellRangeAddress);
            }
            currentRow += count;
        }
    }

    private void initTargetColumnIndices() {
        Field[] fields = this.elementType.getDeclaredFields();
        int index = 0;
        for (Field field : fields) {
            if (field.isAnnotationPresent(ExcelProperty.class)) {
                ExcelMerge excelMerge = field.getAnnotation(ExcelMerge.class);
                if (excelMerge != null && excelMerge.needMerge()) {
                    ExcelProperty property = field.getAnnotation(ExcelProperty.class);
                    int colIndex = property.index() > -1 ? property.index() : index;
                    targetColumnIndex.add(colIndex);
                }
                index++;
            }
        }
    }

    private List<Integer> calculateGroupCounts(List<?> dataList) {
        if (CollectionUtils.isEmpty(dataList)) return new ArrayList<>();
        List<Field> pkFields = new ArrayList<>();
        for (Field field : this.elementType.getDeclaredFields()) {
            ExcelMerge excelMerge = field.getAnnotation(ExcelMerge.class);
            if (excelMerge != null && excelMerge.isPk()) {
                field.setAccessible(true);
                pkFields.add(field);
            }
        }

        List<Integer> groupCounts = new ArrayList<>();
        int count = 1;
        for (int i = 1; i < dataList.size(); i++) {
            Object pre = dataList.get(i - 1);
            Object cur = dataList.get(i);
            boolean isSame = true;
            for (Field field : pkFields) {
                try {
                    if (!Objects.equals(field.get(pre), field.get(cur))) {
                        isSame = false;
                        break;
                    }
                } catch (IllegalAccessException e) {
                    isSame = false;
                }
            }
            if (isSame) count++;
            else {
                groupCounts.add(count);
                count = 1;
            }
        }
        groupCounts.add(count);
        return groupCounts;
    }
}
```

### 4. 自适应列宽处理器 CustomCellWidthHandler

**逻辑**：
+ 计算逻辑：复用了 ExcelStyleHelper.getCellValueAsString 获取值的字符串长度（字节数），取该列最大值乘以系数 256 设置列宽。
+ 最大宽度限制：为了防止列过宽影响阅读，设置了 MAX_COLUMN_WIDTH = 60。

**场景**：内容太长显示不全。 

``` java file=CustomCellWidthHandler.java
import com.alibaba.excel.metadata.Head;
import com.alibaba.excel.metadata.data.WriteCellData;
import com.alibaba.excel.write.metadata.holder.WriteSheetHolder;
import com.alibaba.excel.write.style.column.AbstractColumnWidthStyleStrategy;
import com.kcidea.oa.config.excel.helper.ExcelStyleHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 自定义列宽
 * @author yeweiwei
 * @version 1.0
 * @date 2026/1/30
 **/
@Slf4j
public class CustomCellWidthHandler extends AbstractColumnWidthStyleStrategy {
    private final Map<Integer, Map<Integer, Integer>> cache = new HashMap<>(8);
    private static final int MAX_COLUMN_WIDTH = 60;

    @Override
    protected void setColumnWidth(WriteSheetHolder writeSheetHolder, List<WriteCellData<?>> cellDataList, Cell cell,
                                  Head head, Integer relativeRowIndex, Boolean isHead) {
        boolean needSetWidth = isHead || !CollectionUtils.isEmpty(cellDataList);
        if (needSetWidth) {
            Map<Integer, Integer> maxColumnWidthMap =
                    cache.computeIfAbsent(writeSheetHolder.getSheetNo(), k -> new HashMap<>(16));
            int columnWidth = this.dataLength(cellDataList, cell, isHead);
            if (columnWidth >= 0) {
                if (columnWidth > MAX_COLUMN_WIDTH) {
                    columnWidth = MAX_COLUMN_WIDTH;
                }
                Integer maxColumnWidth = maxColumnWidthMap.get(cell.getColumnIndex());
                if (maxColumnWidth == null || columnWidth > maxColumnWidth) {
                    maxColumnWidthMap.put(cell.getColumnIndex(), columnWidth);
                    writeSheetHolder.getSheet().setColumnWidth(cell.getColumnIndex(), columnWidth * 256);
                }
            }
        }
    }

    private Integer dataLength(List<WriteCellData<?>> cellDataList, Cell cell, Boolean isHead) {
        if (Boolean.TRUE.equals(isHead)) {
            return cell.getStringCellValue().getBytes().length;
        }
        WriteCellData<?> cellData = CollectionUtils.isEmpty(cellDataList) ? null : cellDataList.get(0);
        String value = ExcelStyleHelper.getCellValueAsString(cellData, cell);
        return StringUtils.hasLength(value) ? value.getBytes().length : 0;
    }
}
```

## 四、 统一入口 ExcelUtil
最后，我们将所有组件封装在 ExcelUtil 中，对外提供简洁的 API，它默认集成了上述所有 Handler。
这个类还包含了数据读取的监听器 (ModelExcelListener)，实现了读写一体。

``` java file=ExcelUtil.java
import com.alibaba.excel.EasyExcelFactory;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.event.AnalysisEventListener;
import com.alibaba.excel.exception.ExcelDataConvertException;
import com.alibaba.excel.write.metadata.WriteSheet;
import com.kcidea.oa.config.excel.handler.CustomCellStyleHandler;
import com.kcidea.oa.config.excel.handler.CustomCellWidthHandler;
import com.kcidea.oa.config.excel.handler.CustomMergeStrategy;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.CollectionUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

/**
 * Excel工具类
 * @author yeweiwei
 * @version 1.0
 * @date 2026/1/30
 **/
@Slf4j
public class ExcelUtil {
    private ExcelUtil() { throw new IllegalStateException("Utility class"); }
    private static final int BATCH_COUNT = 1000;

    /**
     * 1. 模型解析监听器 (用于读取)
     */
    public static class ModelExcelListener<E> extends AnalysisEventListener<E> {
        @Getter private final List<E> dataList = new ArrayList<>();
        private final Consumer<List<E>> batchConsumer;
        private final StringBuilder errorMsgBuilder = new StringBuilder();
        @Getter private Integer errorCount = 0;
        private final List<E> batchList = new ArrayList<>(BATCH_COUNT);

        public ModelExcelListener() { this.batchConsumer = null; }
        public ModelExcelListener(Consumer<List<E>> batchConsumer) { this.batchConsumer = batchConsumer; }

        @Override
        public void invoke(E object, AnalysisContext context) {
            batchList.add(object);
            if (batchList.size() >= BATCH_COUNT) processBatch();
        }

        @Override
        public void doAfterAllAnalysed(AnalysisContext context) {
            if (!batchList.isEmpty()) processBatch();
        }

        private void processBatch() {
            if (batchConsumer != null) batchConsumer.accept(new ArrayList<>(batchList));
            else dataList.addAll(batchList);
            batchList.clear();
        }

        @Override
        public void onException(Exception exception, AnalysisContext context) {
            if (exception instanceof ExcelDataConvertException) {
                ExcelDataConvertException e = (ExcelDataConvertException) exception;
                String format = String.format("第%d行，第%d列解析异常，数据:[%s]，异常信息:%s",
                        e.getRowIndex(), e.getColumnIndex(), e.getCellData(), e.getMessage());
                log.error(format);
                errorMsgBuilder.append(format).append("\n");
                errorCount++;
            } else {
                log.error("Excel解析未知异常", exception);
                errorMsgBuilder.append("未知异常: ").append(exception.getMessage()).append("\n");
            }
        }
        public String getErrorMsg() { return errorMsgBuilder.toString(); }
    }

    // 读取相关方法
    public static <T> List<T> readExcel(String filePath, int headLineNum, Class<T> clazz) {
        ModelExcelListener<T> listener = new ModelExcelListener<>();
        EasyExcelFactory.read(filePath, clazz, listener).sheet().headRowNumber(headLineNum).doRead();
        return listener.getDataList();
    }
    
    public static <T> void readExcel(String filePath, int headLineNum, Class<T> clazz, Consumer<List<T>> consumer) {
        ModelExcelListener<T> listener = new ModelExcelListener<>(consumer);
        EasyExcelFactory.read(filePath, clazz, listener).sheet().headRowNumber(headLineNum).doRead();
    }

    // 写入 - Stream 核心
    public static void exportExcelToStream(OutputStream os, List<?> dataList, Class<?> clazz, String sheetName, List<Object> handlers) {
        if (CollectionUtils.isEmpty(dataList)) {
            EasyExcelFactory.write(os, clazz).sheet(sheetName).doWrite(new ArrayList<>());
            return;
        }
        try (ExcelWriter excelWriter = EasyExcelFactory.write(os, clazz).build()) {
            WriteSheet writeSheet = EasyExcelFactory.writerSheet(sheetName).build();
            if (handlers != null && !handlers.isEmpty()) {
                writeSheet.setCustomWriteHandlerList(handlers);
            }
            writeDataToSheet(excelWriter, writeSheet, dataList);
        }
    }

    // 写入 - Web 导出
    public static void exportExcelToWeb(HttpServletResponse response, String fileName, String sheetName,
                                        List<?> dataList, Class<?> clazz) throws IOException {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setCharacterEncoding("utf-8");
        String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8.name()).replace("\\+", "%20");
        response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + encodedFileName + ".xlsx");

        // 默认添加所有自定义 Handler
        List<Object> handlers = new ArrayList<>();
        handlers.add(new CustomCellWidthHandler());
        handlers.add(new CustomMergeStrategy(dataList, clazz));
        handlers.add(new CustomCellStyleHandler(clazz));

        exportExcelToStream(response.getOutputStream(), dataList, clazz, sheetName, handlers);
    }
    
    // 写入 - byte[] (旧版兼容)
    public static byte[] exportExcelMergeCell(List<?> dataList, Class<?> pojoClass) {
        List<Object> handlerList = new ArrayList<>();
        handlerList.add(new CustomCellWidthHandler());
        handlerList.add(new CustomMergeStrategy(dataList, pojoClass));
        handlerList.add(new CustomCellStyleHandler(pojoClass));
        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            exportExcelToStream(os, dataList, pojoClass, "sheet1", handlerList);
            return os.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("导出Excel失败", e);
        }
    }
    
    // 多 Sheet 页导出
    public static byte[] exportExcelWithManySheetsMergeCell(Map<String, List<?>> dataMap, Class<?> pojoClass) {
        try (ByteArrayOutputStream os = new ByteArrayOutputStream();
             ExcelWriter excelWriter = EasyExcelFactory.write(os, pojoClass).build()) {
            for (Map.Entry<String, List<?>> entry : dataMap.entrySet()) {
                String sheetName = entry.getKey();
                List<?> dataList = entry.getValue();
                WriteSheet writeSheet = EasyExcelFactory.writerSheet(sheetName).build();
                List<Object> handlers = new ArrayList<>();
                handlers.add(new CustomCellWidthHandler());
                handlers.add(new CustomMergeStrategy(dataList, pojoClass));
                handlers.add(new CustomCellStyleHandler(pojoClass));
                writeSheet.setCustomWriteHandlerList(handlers);
                writeDataToSheet(excelWriter, writeSheet, dataList);
            }
            excelWriter.finish();
            return os.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("多Sheet导出失败", e);
        }
    }

    // 辅助：分批写入
    private static void writeDataToSheet(ExcelWriter excelWriter, WriteSheet writeSheet, List<?> list) {
        if (CollectionUtils.isEmpty(list)) return;
        int totalSize = list.size();
        for (int i = 0; i < totalSize; i += BATCH_COUNT) {
            int end = Math.min(i + BATCH_COUNT, totalSize);
            excelWriter.write(list.subList(i, end), writeSheet);
        }
    }
}
```

## 五、 使用示例

假设我们要导出一个 “项目成员周报”，要求：
1. 项目名称：相同的项目要合并。
2. 风险状态：如果是 "高风险"，背景显示红色。
3. 对齐：项目名称居中对齐。

### 1. 定义 VO 对象

``` java file=ProjectReportVO.java
import com.alibaba.excel.annotation.ExcelProperty;
import com.kcidea.oa.config.excel.aop.ExcelMerge;
import com.kcidea.oa.config.excel.aop.ExcelStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;

@Data
public class ProjectReportVO {

    @ExcelProperty("项目名称")
    // isPk=true 表示这是合并的主键；needMerge=true 表示该列要合并
    // 居中对齐
    @ExcelMerge(isPk = true, needMerge = true)
    @ExcelStyle(horizontalAlignment = HorizontalAlignment.CENTER)
    private String projectName;

    @ExcelProperty("成员姓名")
    private String memberName;

    @ExcelProperty("风险状态")
    // 正则匹配 "高风险"，匹配成功则背景红色 (颜色索引 10)
    @ExcelStyle(regexp = "高风险", fillForegroundColor = 10)
    private String riskStatus;
}
```

### 2. Controller 调用
``` java file=ProjectController.java
@GetMapping("/export")
public void exportProjectReport(HttpServletResponse response) throws IOException {
    List<ProjectReportVO> list = new ArrayList<>();
    
    // 模拟数据
    // 这两条记录 "项目A" 相同，会自动合并第一列
    list.add(new ProjectReportVO("项目A", "张三", "正常"));
    list.add(new ProjectReportVO("项目A", "李四", "高风险")); // "高风险" 单元格会变红
    
    list.add(new ProjectReportVO("项目B", "王五", "正常"));

    // 导出
    ExcelUtil.exportExcelToWeb(response, "项目周报", "Sheet1", list, ProjectReportVO.class);
}
```


## 六. 注意事项

+ 内存考量：虽然 exportExcelToWeb  优化了流输出，但如果 dataList 本身非常大（如百万级），建议在业务层分批查询并分批写入，而不是一次性查出所有 List 传给工具类。
+ 合并策略限制：CustomMergeStrategy 依赖内存中的 List 进行分组计算 。这意味着使用合并策略时，必须一次性传入该 Sheet 的所有数据，无法支持流式分页写入时的跨页合并。
