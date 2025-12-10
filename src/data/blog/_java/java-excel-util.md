---
author: lavie
pubDatetime: 2025-07-30T09:40:01Z
modDatetime: 2025-11-14T02:50:58Z
title: Java中使用EasyExcel处理表格
featured: false
draft: false
private: false
tags:
  - java
description: Java中使用EasyExcel读取、导出表格，自定义表格样式。
---

 这篇文章记录了一个表格的工具类，使用EasyExcel读取、导出表格，自定义表格样式。

## Table of contents

## 1.使用EasyExcel读写表格

```java
/**
 * @author yeweiwei
 * @version 1.0
 * @date 2025/7/30
 **/
@Slf4j
public class ExcelUtil {

    /**
     * 批量读取阈值
     */
    private static final int READ_BATCH_COUNT = 1000;

    /**
     * 批量写阈值
     */
    private static final int WRITE_BATCH_COUNT = 100;

    /**
     * 模型解析监听器 -- 每解析一行会回调invoke()方法，整个excel解析结束会执行doAfterAllAnalysed()方法
     */
    @Getter
    @Setter
    private static class ModelExcelListener<E> extends AnalysisEventListener<E> {
        private List<E> dataList = new ArrayList<E>();

        private String errorMsg = "";

        private Integer errorCount = 0;

        /**
         * 批处理阈值
         */
        List<E> list = new ArrayList<>(READ_BATCH_COUNT);
        Map<Integer, String> headMap = Maps.newHashMap();
        List<Map<Integer, String>> excelHeadMapList = Lists.newArrayList();

        @Override
        public void invoke(E object, AnalysisContext context) {
            list.add(object);
            if (list.size() >= READ_BATCH_COUNT) {
                saveData();
                list.clear();
            }
        }

        @Override
        public void invokeHeadMap(Map<Integer, String> headMap, AnalysisContext context) {
            super.invokeHeadMap(headMap, context);
            Set<Integer> keySet = headMap.keySet();
            for (Integer key : keySet) {
                String head = headMap.get(key);
                if (!Strings.isNullOrEmpty(head)) {
                    head = head.replace("\n", " ");
                    head = head.replace("\ufeff", "");
                    this.headMap.put(key, head);
                }
            }
            excelHeadMapList.add(this.headMap);
        }

        @Override
        public void doAfterAllAnalysed(AnalysisContext context) {
            saveData();
        }

        @Override
        public void onException(Exception exception, AnalysisContext context) throws Exception {
            ExcelDataConvertException excelDataConvertException = (ExcelDataConvertException) exception;
            Integer rowIndex = excelDataConvertException.getRowIndex();
            Integer columnIndex = excelDataConvertException.getColumnIndex();
            CellData<?> cellData = excelDataConvertException.getCellData();
            String format = String.format("第%s行，第%s列解析异常，跳过不处理，数据为:%s。\n", rowIndex, columnIndex, cellData);
            log.error(format);
            errorMsg = errorMsg + format;
            errorCount++;
        }

        private void saveData() {
            dataList.addAll(list);
        }
    }

    /**
     * 使用 模型 来读取Excel
     */
    public static <T> List<T> readExcel(String filePath, int headLineNum, Class<T> clazz) {
        ModelExcelListener<T> listener = new ModelExcelListener<>();
        EasyExcel.read(filePath, clazz, listener).sheet().headRowNumber(headLineNum).doRead();
        return listener.getDataList();
    }

    /*
     * 保存数据到文件
     */
    public static void saveExcel(List<?> list, Class<?> clazz, String filePath) {
        try(ExcelWriter excelWriter = EasyExcel.write(filePath, clazz).build()) {
            // 这里注意 如果同一个sheet只要创建一次
            WriteSheet writeSheet = EasyExcel.writerSheet("sheet").build();
            // 去调用写入
            writeData(list, excelWriter, writeSheet);
        }
    }

    /**
     * 导出多个sheet页并且合并单元格
     *
     * @param dataMap   数据集合
     * @param pojoClass 导出对象
     * @return 导出内容
     * @author yeweiwei
     * @date 2025/5/12 15:01
     */
    public static <T> byte[] exportExcelWithManySheetsMergeCell(Map<String, List<T>> dataMap, Class<T> pojoClass) {
        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            ExcelWriter excelWriter = EasyExcel.write(os, pojoClass).build();
            try {
                for (Map.Entry<String, List<T>> entry : dataMap.entrySet()) {
                    String sheetName = entry.getKey();
                    List<T> dataList = entry.getValue();
                    WriteSheet writeSheet = EasyExcel.writerSheet(sheetName).build();
                    writeSheet.setCustomWriteHandlerList(
                            Lists.newArrayList(
                                    new CustomColumnWidthHandler(),
                                    new CustomMergeStrategy(dataList, pojoClass),
                                    new CustomCellStyleHandler(pojoClass)
                            )
                    );

                    int totalSize = dataList.size();
                    for (int start = 0; start < totalSize; start += WRITE_BATCH_COUNT) {
                        int end = Math.min(start + WRITE_BATCH_COUNT, totalSize);
                        List<T> batchList = dataList.subList(start, end);
                        excelWriter.write(batchList, writeSheet);
                    }
                }
            } finally {
                // 必须手动调用 finish() 才能写入 ByteArrayOutputStream
                excelWriter.finish();
            }
            return os.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to export Excel", e);
        }
    }

    public static <T> byte[] exportExcel(List<T> dataList, Class<T> pojoClass, List<WriteHandler> handlerList) {
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        ExcelWriter excelWriter = null;
        try {
            // 这里 需要指定写用哪个class去写
            excelWriter = EasyExcelFactory.write(os, pojoClass).build();
            // 这里注意 如果同一个sheet只要创建一次
            WriteSheet writeSheet = EasyExcelFactory
                    .writerSheet("sheet1")
                    .build();
            writeSheet.setCustomWriteHandlerList(handlerList);
            // 去调用写入
            writeData(dataList, excelWriter, writeSheet);
        } finally {
            // 千万别忘记finish 会帮忙关闭流
            if (excelWriter != null) {
                excelWriter.finish();
            }
        }
        return os.toByteArray();
    }

    public static <T> byte[] exportExcelMergeCell(List<T> dataList, Class<T> pojoClass) {
        List<WriteHandler> handlerList = Lists.newArrayList();
        handlerList.add(new CustomColumnWidthHandler());
        handlerList.add(new CustomMergeStrategy(dataList, pojoClass));
        handlerList.add(new CustomCellStyleHandler(pojoClass));
        return exportExcel(dataList, pojoClass, handlerList);
    }

    /**
     * 写数据
     *
     * @param list        数据
     * @param excelWriter excelWriter
     * @param writeSheet  sheet页
     * @author yeweiwei
     * @date 2022/10/20 14:15
     */
    private static void writeData(List<?> list, ExcelWriter excelWriter, WriteSheet writeSheet) {
        int listSize = list.size();
        if (0 == listSize) {
            excelWriter.write(Lists.newArrayList(), writeSheet);
            return;
        }
        for (int i = 0; i < listSize; i+=WRITE_BATCH_COUNT) {
            List<?> newList;
            if (i + WRITE_BATCH_COUNT > listSize) {
                newList = list.subList(i, listSize);
            }else {
                newList = list.subList(i, i + WRITE_BATCH_COUNT);
            }
            excelWriter.write(newList, writeSheet);
        }
    }
}
```

## 2.自定义WriteHandler
上面的代码实现的简单的读写功能，或者将数据写入字节流。  
如果需要合并单元格、高亮显示等自定义样式，还需要做特殊处理。  
EasyExcel导出表格时支持自定义一些`WriteHandler`，例如上述代码中出现的`CustomColumnWidthHandler`、`CustomMergeStrategy`、`CustomCellStyleHandler`，在`writeSheet.setCustomWriteHandlerList()`中传入需要的Handler即可。

### 定义表格样式类和ExcelStyleUtil
表格样式类
```java
@Data
public class ExcelStyleModel {

    /**
     * 第几列
     */
    private Integer columIndex;

    /**
     * 正则表达式
     */
    private String regexp;

    /**
     * 样式
     */
    private WriteCellStyle writeCellStyle;

    /**
     * 样式
     */
    private CellStyle cellStyle;
}
```

ExcelStyleUtil中封装了自定义表格样式Handler中通用的方法。
```java
public class ExcelStyleUtil {

    private static final Integer DATE_NUMBER = 14;
    private static final Integer TIME_NUMBER = 21;
    private static final Integer DATE_TIME_NUMBER = 22;

    public static String getCellValue(Cell cell) {
        String cellValue = "";
        if (cell == null) {
            return cellValue;
        }
        // 判断数据的类型
        CellType cellType = cell.getCellType();
        switch (cellType) {
            case STRING:
                cellValue = String.valueOf(cell.getStringCellValue());
                break;
            case BOOLEAN:
                cellValue = String.valueOf(cell.getBooleanCellValue());
                break;
            case FORMULA:
                cellValue = String.valueOf(cell.getCellFormula());
                break;
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    // 处理日期格式、时间格式
                    SimpleDateFormat sdf;
                    if (cell.getCellStyle().getDataFormat() == DATE_NUMBER) {
                        sdf = new SimpleDateFormat("yyyy/MM/dd");
                    } else if (cell.getCellStyle().getDataFormat() == TIME_NUMBER) {
                        sdf = new SimpleDateFormat("HH:mm:ss");
                    } else if (cell.getCellStyle().getDataFormat() == DATE_TIME_NUMBER) {
                        sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
                    } else {
                        throw new CustomException("日期格式错误!!!");
                    }
                    Date date = cell.getDateCellValue();
                    cellValue = sdf.format(date);
                } else if (cell.getCellStyle().getDataFormat() == 0) {
                    //处理数值格式
                    double value = cell.getNumericCellValue();
                    cellValue = String.valueOf(value);
                    if (value == Math.floor(value)) {
                        // 整数
                        cellValue = cellValue.substring(0, cellValue.indexOf("."));
                    }
                }
                break;
            case BLANK:
            case _NONE:
            case ERROR:
            default:
                cellValue = "";
                break;
        }
        return cellValue;
    }


    /**
     * 判断是否需要合并单元格
     *
     * @param regexp 正则
     * @param value  值
     * @return flag
     * @author yeweiwei
     * @date 2022/12/2 15:38
     */
    public static boolean getMergeFlag(String regexp, String value) {
        boolean mergeFlag = Strings.isNullOrEmpty(regexp);
        Pattern pattern = Pattern.compile(regexp);
        Matcher matcher = pattern.matcher(value);
        if (matcher.matches()) {
            mergeFlag = true;
        }
        return mergeFlag;
    }
}
```

### 表格自适应列宽
EasyExcel导出表格，由于列宽问题数据显示不全，还需要手动设置一下列宽。  
使用`CustomColumnWidthHandler`可以根据表格内容自动调整列宽。

```java
public class CustomColumnWidthHandler extends AbstractColumnWidthStyleStrategy {
    private static final int MAP_CAPACITY = 8;

    private static final int MAX_COLUMN_WIDTH = 80;

    private final LruLinkedHashMap<Integer, Map<Integer, Integer>> cache = new LruLinkedHashMap<>(MAP_CAPACITY);

    public CustomColumnWidthHandler() {
        // 构造函数
    }

    @Override
    protected void setColumnWidth(WriteSheetHolder writeSheetHolder, List<WriteCellData<?>> cellDataList, Cell cell,
                                  Head head, Integer relativeRowIndex, Boolean isHead) {
        boolean needSetWidth = isHead || !CollectionUtils.isEmpty(cellDataList);
        if (needSetWidth) {
            Map<Integer, Integer> maxColumnWidthMap =
                    cache.computeIfAbsent(writeSheetHolder.getSheetNo(), k -> new HashMap<>(16));

            Integer columnWidth = this.dataLength(cellDataList, cell, isHead);
            if (columnWidth >= 0) {
                if (columnWidth > MAX_COLUMN_WIDTH) {
                    columnWidth = MAX_COLUMN_WIDTH;
                }
                Integer maxColumnWidth = (Integer) ((Map<?, ?>) maxColumnWidthMap).get(cell.getColumnIndex());
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
        } else {
            WriteCellData<?> writeCellData = cellDataList.get(0);
            CellDataTypeEnum type = writeCellData.getType();
            if (type == null) {
                return -1;
            }
            switch (type) {
                case STRING:
                    return writeCellData.getStringValue().getBytes().length;
                case BOOLEAN:
                    return writeCellData.getBooleanValue().toString().getBytes().length;
                case NUMBER:
                    return writeCellData.getNumberValue().toString().getBytes().length;
                default:
                    return -1;

            }
        }
    }
}
```
### ExcelStyle注解
使用注解定义表格样式，在导出实体类的field上使用注解。
+ regexp：正则表达式，field值符合正则时使用注解的样式。如果regexp是空的，那么样式会整列生效，即调整列样式。
+ fontName：字体
+ fontHeightInPoints：字高
+ fillForegroundColor：颜色
+ horizontalAlignment：左右对齐方式
+ verticalAlignment：上下对齐方式

```java
@Target({ElementType.FIELD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ExcelStyle {
    String regexp() default "";

    String fontName() default "";

    short fontHeightInPoints() default 12;

    short fillForegroundColor() default -1;

    HorizontalAlignment horizontalAlignment() default HorizontalAlignment.LEFT;

    VerticalAlignment verticalAlignment() default VerticalAlignment.CENTER;
}
```

### 自定义单元格样式

```java
@Slf4j
public class CustomCellStyleHandler implements CellWriteHandler {

    private static final int MAP_CAPACITY = 8;

    private final LruLinkedHashMap<String, Map<Integer, ExcelStyleModel>> classCellStyleMap = new LruLinkedHashMap<>(MAP_CAPACITY);

    private final Class<?> clazz;

    public CustomCellStyleHandler(Class<?> clazz) {
        this.clazz = clazz;
    }

    @Override
    public void afterCellDispose(WriteSheetHolder writeSheetHolder, WriteTableHolder writeTableHolder,
                                 List<WriteCellData<?>> cellDataList, Cell cell, Head head,
                                 Integer relativeRowIndex, Boolean isHead) {
        try {
            if (Boolean.FALSE.equals(isHead)) {
                // 判断Map中是否保存了这个类的数据，没有就初始化
                String canonicalName = clazz.getCanonicalName();
                if (!classCellStyleMap.containsKey(canonicalName)) {
                    initClassCellStyleMap();
                }
                Map<Integer, ExcelStyleModel> cellStyleMap = classCellStyleMap.get(canonicalName);

                // 获取单元格的值
                WriteCellData<?> writeCellData = cellDataList.get(0);
                String value = ExcelStyleUtil.getCellValue(cell);

                // 此单元格有ExcelStyle注解，并且值不为null
                if (cellStyleMap.containsKey(writeCellData.getColumnIndex()) && null != value) {
                    ExcelStyleModel styleModel = cellStyleMap.get(writeCellData.getColumnIndex());
                    String regexp = styleModel.getRegexp();
                    boolean mergeFlag = ExcelStyleUtil.getMergeFlag(regexp, value);
                    if (mergeFlag) {
                        WriteCellStyle writeCellStyle = styleModel.getWriteCellStyle();
                        writeCellData.setWriteCellStyle(writeCellStyle);
                    }
                }
            }
        } catch (Exception exception) {
            log.error(exception.getMessage());
        }
    }

    /**
     * 初始化map集合，key为类名，value: key是导出列下标，value是excelStyleModel
     *
     * @author yeweiwei
     * @date 2022/10/13 9:51
     */
    private void initClassCellStyleMap() {
        Map<Integer, ExcelStyleModel> cellStyleMap = Maps.newHashMap();
        Field[] declaredFields = clazz.getDeclaredFields();
        int index = 0;
        for (Field declaredField : declaredFields) {
            // 是否为导出字段
            ExcelProperty excelField = declaredField.getAnnotation(ExcelProperty.class);
            if (excelField != null) {
                // 是否有自定义样式的注解
                ExcelStyle annotation = declaredField.getAnnotation(ExcelStyle.class);
                if (annotation != null) {
                    String regexp = annotation.regexp();
                    ExcelStyleModel excelStyleModel = new ExcelStyleModel();
                    excelStyleModel.setColumIndex(index);
                    excelStyleModel.setRegexp(regexp);
                    WriteCellStyle writeCellStyle = initWriteCellStyle(annotation);
                    excelStyleModel.setWriteCellStyle(writeCellStyle);
                    cellStyleMap.put(index, excelStyleModel);
                }
                index++;
            }
        }
        classCellStyleMap.put(clazz.getCanonicalName(), cellStyleMap);
    }

    /**
     * 初始化单元格格式
     *
     * @param annotation 注解
     * @return 单元格格式
     * @author yeweiwei
     * @date 2022/10/13 9:52
     */
    private WriteCellStyle initWriteCellStyle(ExcelStyle annotation) {
        WriteCellStyle writeCellStyle = new WriteCellStyle();
        WriteFont writeFont = new WriteFont();
        writeFont.setFontName(annotation.fontName());
        writeFont.setFontHeightInPoints(annotation.fontHeightInPoints());
        writeCellStyle.setWriteFont(writeFont);

        if (annotation.fillForegroundColor() != -1) {
            // 这里需要指定 FillPatternType 为FillPatternType.SOLID_FOREGROUND 不然无法显示背景颜色.
            writeCellStyle.setFillPatternType(FillPatternType.SOLID_FOREGROUND);
            writeCellStyle.setFillForegroundColor(annotation.fillForegroundColor());
        }
        writeCellStyle.setHorizontalAlignment(annotation.horizontalAlignment());
        writeCellStyle.setVerticalAlignment(annotation.verticalAlignment());
        return writeCellStyle;
    }
}
```

使用方式，需求：学校名称这一列整列居中，产品状态为停订单元格高亮显示。
``` java
@Data
@ExcelIgnoreUnannotated
public class ExportModel implements Serializable {
    private static final long serialVersionUID = -2223809682676612172L;

    /**
     * 学校名称，整列居中，不需要设置正则
     */
    @ExcelProperty("学校名称")
    @ExcelStyle(horizontalAlignment = HorizontalAlignment.CENTER)
    private String schoolName;

    /**
     * 产品名称
     */
    @ExcelProperty("产品名称")
    private String productName;

    /**
     * 产品状态，值为停订的高亮显示
     */
    @ExcelProperty("产品状态")
    @ExcelStyle(regexp = "^停订$", fillForegroundColor = 10)
    private String productState;
}
```

### 自定义行样式
在某些时候，我们可能不止要设置某些单元格样式，可能需要设置整行的样式。
```java
@Slf4j
public class CustomRowStyleHandler implements RowWriteHandler {

    private static final int MAP_CAPACITY = 8;

    /**
     * 类的ExcelStyle注解缓存，key为类名，value: key是导出列下标，value是excelStyleModel
     */
    private final LruLinkedHashMap<String, Map<Integer, ExcelStyleModel>> classRowStyleMap = new LruLinkedHashMap<>(MAP_CAPACITY);

    private final Class<?> clazz;

    public CustomRowStyleHandler(Class<?> clazz) {
        this.clazz = clazz;
    }

    @Override
    public void afterRowDispose(WriteSheetHolder writeSheetHolder, WriteTableHolder writeTableHolder, Row row,
                                Integer relativeRowIndex, Boolean isHead) {
        // 跳过标题行
        if (Boolean.TRUE.equals(isHead)) {
            return;
        }
        try {
            // 初始化map
            String canonicalName = clazz.getCanonicalName();
            if (!classRowStyleMap.containsKey(canonicalName)) {
                Workbook workbook = writeSheetHolder.getSheet().getWorkbook();
                initClassRowStyleMap(workbook);
            }
            Map<Integer, ExcelStyleModel> rowStyleMap = classRowStyleMap.get(canonicalName);

            // 循环单元格，找到第一个有ExcelStyle注解且正则匹配的单元格
            for (int index = 0; index < row.getLastCellNum(); index++) {
                // 获得属性值
                Cell cell = row.getCell(index);
                String value = ExcelStyleUtil.getCellValue(cell);
                if (rowStyleMap.containsKey(index) && null != value) {
                    ExcelStyleModel styleModel = rowStyleMap.get(index);
                    // 获得注解，正则匹配
                    String regexp = styleModel.getRegexp();
                    boolean mergeFlag = ExcelStyleUtil.getMergeFlag(regexp, value);
                    if (mergeFlag) {
                        CellStyle cellStyle = styleModel.getCellStyle();
                        // 循环设置这一行每个单元格的样式
                        Iterator<Cell> cellIterator = row.cellIterator();
                        while (cellIterator.hasNext()) {
                            Cell next = cellIterator.next();
                            next.setCellStyle(cellStyle);
                        }
                        break;
                    }
                }
            }
        } catch (Exception exception) {
            log.error(exception.getMessage());
        }
    }

    /**
     * 初始化map集合，key为类名，value: key是导出列下标，value是excelStyleModel
     *
     * @param workbook 工作簿
     * @author yeweiwei
     * @date 2022/10/13 9:46
     */
    private void initClassRowStyleMap(Workbook workbook) {
        Map<Integer, ExcelStyleModel> cellStyleMap = Maps.newHashMap();
        Field[] declaredFields = clazz.getDeclaredFields();
        int index = 0;
        for (Field declaredField : declaredFields) {
            // 是否为导出字段
            ExcelProperty excelField = declaredField.getAnnotation(ExcelProperty.class);
            if (excelField != null) {
                // 是否有自定义样式的注解
                ExcelStyle annotation = declaredField.getAnnotation(ExcelStyle.class);
                if (annotation != null) {
                    String regexp = annotation.regexp();
                    CellStyle cellStyle = initCellStyle(workbook, annotation);
                    ExcelStyleModel styleModel = new ExcelStyleModel();
                    styleModel.setColumIndex(index);
                    styleModel.setRegexp(regexp);
                    styleModel.setCellStyle(cellStyle);
                    cellStyleMap.put(index, styleModel);
                }
                index++;
            }
        }
        classRowStyleMap.put(clazz.getCanonicalName(), cellStyleMap);
    }

    /**
     * 初始化单元格格式
     *
     * @param workbook   工作簿
     * @param annotation 注解
     * @return 单元格格式
     * @author yeweiwei
     * @date 2022/8/23 17:38
     */
    private CellStyle initCellStyle(Workbook workbook, ExcelStyle annotation) {
        CellStyle cellStyle = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setFontName(annotation.fontName());
        font.setFontHeightInPoints(annotation.fontHeightInPoints());
        cellStyle.setFont(font);
        if (annotation.fillForegroundColor() != -1) {
            // 这里需要指定 FillPatternType 为FillPatternType.SOLID_FOREGROUND 不然无法显示背景颜色.
            cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            cellStyle.setFillForegroundColor(annotation.fillForegroundColor());
        }
        cellStyle.setAlignment(annotation.horizontalAlignment());
        cellStyle.setVerticalAlignment(annotation.verticalAlignment());
        return cellStyle;
    }
}
```

使用方式，需求：学校名称这一列整列居中，产品状态为停订的整行高亮显示。
``` java
@Data
@ExcelIgnoreUnannotated
public class ExportModel implements Serializable {
    private static final long serialVersionUID = -2223809682676612172L;

    /**
     * 学校名称
     */
    @ExcelProperty("学校名称")
    @ExcelStyle(horizontalAlignment = HorizontalAlignment.CENTER)
    private String schoolName;

    /**
     * 产品名称
     */
    @ExcelProperty("产品名称")
    private String productName;

    /**
     * 产品状态
     */
    @ExcelProperty("产品状态")
    @ExcelStyle(regexp = "^停订$", fillForegroundColor = 10)
    private String productState;
}
```

### 单元格合并策略

首先创建一个注解，定义合并单元格的策略。
+ isPk：合并单元格的依据，设置为true，表格连续行如果这个字段的值是相同的，才会合并单元格
+ needMerge：表示哪些字段需要合并
+ isPk只用来计算连续行是否需要合并，具体有哪些字段需要合并由needMerge决定。
``` java
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

```java
@Slf4j
public class CustomMergeStrategy extends AbstractMergeStrategy {
    /**
     * 分组，每几行合并一次
     */
    private final List<Integer> exportFieldGroupCountList;

    /**
     * 目标合并列index
     */
    private final List<Integer> targetColumnIndex = Lists.newArrayList();

    // 需要开始合并单元格的首行index
    private Integer beginIndex;

    private final Integer titleRowNumber;

    private final Class<?> elementType;

    public CustomMergeStrategy(List<?> exportDataList, Class<?> elementType) {
        this.elementType = elementType;
        this.titleRowNumber = 0;
        this.exportFieldGroupCountList = getGroupCountList(exportDataList);
    }

    public CustomMergeStrategy(List<?> exportDataList, Class<?> elementType, Integer titleRowNumber) {
        this.elementType = elementType;
        this.titleRowNumber = titleRowNumber;
        this.exportFieldGroupCountList = getGroupCountList(exportDataList);
    }

    @Override
    protected void merge(Sheet sheet, Cell cell, Head head, Integer relativeRowIndex) {

        if (null == beginIndex) {
            beginIndex = cell.getRowIndex();
        }
        if (CollectionUtils.isEmpty(targetColumnIndex)) {
            initTarget(sheet);
        }
        // 仅从首行以及目标列的单元格开始合并，忽略其他
        if (cell.getRowIndex() == beginIndex && targetColumnIndex.contains(cell.getColumnIndex())) {
            mergeGroupColumn(sheet, cell.getColumnIndex());
        }
    }

    private void mergeGroupColumn(Sheet sheet, int columnIndex) {
        int rowCount = beginIndex;
        for (Integer count : exportFieldGroupCountList) {
            if (count == 1) {
                rowCount += count;
                continue;
            }
            // 合并单元格
            CellRangeAddress cellRangeAddress =
                    new CellRangeAddress(rowCount, rowCount + count - 1, columnIndex, columnIndex);
            sheet.addMergedRegionUnsafe(cellRangeAddress);
            rowCount += count;
        }
    }

    private void initTarget(Sheet sheet) {
        // 获取标题行
        Row titleRow = sheet.getRow(titleRowNumber);
        // 获取标题和下标映射
        Map<String, Integer> nameIndexMap = Maps.newHashMap();
        Iterator<Cell> cellIterator = titleRow.cellIterator();
        while (cellIterator.hasNext()) {
            Cell cell = cellIterator.next();
            nameIndexMap.put(cell.toString(), cell.getColumnIndex());
        }
        // 获取DTO所有的属性
        Field[] fields = this.elementType.getDeclaredFields();
        for (Field theField : fields) {
            // 获取@ExcelProperty注解，用于获取该字段对应在excel中的列的下标
            ExcelProperty easyExcelAnno = theField.getAnnotation(ExcelProperty.class);
            // 获取自定义的注解，用于合并单元格
            ExcelMerge excelMerge = theField.getAnnotation(ExcelMerge.class);
            if (null == easyExcelAnno || null == excelMerge) {
                continue;
            }

            // 获取下标
            Integer index = nameIndexMap.get(easyExcelAnno.value()[0]);
            if (excelMerge.needMerge()) {
                targetColumnIndex.add(index);
            }
        }
    }

    // 该方法将目标列根据值是否相同连续可合并，存储可合并的行数
    private List<Integer> getGroupCountList(List<?> exportDataList) {
        List<String> pkFields = Lists.newArrayList();
        // 获取DTO所有的属性
        Field[] fields = this.elementType.getDeclaredFields();
        for (Field theField : fields) {
            // 获取自定义的注解，用于合并单元格
            ExcelMerge excelMerge = theField.getAnnotation(ExcelMerge.class);
            // 用来判断能否合并的字段，这些字段值全部相等，才能合并
            if (null != excelMerge && excelMerge.isPk()) {
                pkFields.add(theField.getName());
            }
        }
        if (CollectionUtils.isEmpty(exportDataList)) {
            return Lists.newArrayList();
        }

        List<Integer> groupCountList = Lists.newArrayList();
        int count = 1;

        for (int i = 1; i < exportDataList.size(); i++) {
            boolean flag = true;
            for (String fieldName : pkFields) {
                if (!ReflexUtil.compare(exportDataList.get(i), exportDataList.get(i - 1), fieldName)) {
                    groupCountList.add(count);
                    count = 1;
                    flag = false;
                    break;
                }
            }
            if (flag) {
                count++;
            }
        }
        // 处理完最后一条后
        groupCountList.add(count);
        return groupCountList;
    }
}
```

使用方式，需求：相同学校需要将学校名称这一列合并居中显示。  
在`sid`上设置isPk = true，表示学校id相同的行才需要进行合并操作。  
在`schoolName`上设置needMerge = true，表示学校名称这一列需要合并。
```java
@Data
@ExcelIgnoreUnannotated
public class ExportModel implements Serializable {
    private static final long serialVersionUID = -2223809682676612172L;

    /**
     * 学校id
     */
    @ExcelMerge(isPk = true)
    private Long sid;

    /**
     * 学校名称，整列居中，不需要设置正则
     */
    @ExcelProperty("学校名称")
    @ExcelMerge(needMerge = true)
    @ExcelStyle(horizontalAlignment = HorizontalAlignment.CENTER)
    private String schoolName;

    /**
     * 产品名称
     */
    @ExcelProperty("产品名称")
    private String productName;

    /**
     * 产品状态，值为停订的高亮显示
     */
    @ExcelProperty("产品状态")
    @ExcelStyle(regexp = "^停订$", fillForegroundColor = 10)
    private String productState;
}
```
