package com.ye.controller.admin;

import com.ye.model.Blog;
import com.ye.model.Tag;
import com.ye.model.User;
import com.ye.service.BlogService;
import com.ye.service.TagService;
import com.ye.service.TypeService;
import com.ye.vo.BlogQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;


@Controller
@RequestMapping("/admin")
public class BlogController {

    private static final String INPUT = "admin/blogs-input";
    private static final String LIST = "admin/blogs";
    private static final String REDIRECT_LIST = "redirect:/admin/blogs";

    @Autowired
    private BlogService blogService;
    @Autowired
    private TypeService typeService;
    @Autowired
    private TagService tagService;

    @GetMapping("/blogs")
    public String list(@PageableDefault(size = 2, sort = {"updateTime"}, direction = Sort.Direction.DESC)
                                   Pageable pageable, BlogQuery blog, Model model){
        model.addAttribute("types",typeService.listType());
        model.addAttribute("page",blogService.listBlog(pageable,blog));
        return LIST;
    }

    @PostMapping("/blogs/search")
    public String search(@PageableDefault(size = 2, sort = {"updateTime"}, direction = Sort.Direction.DESC)
                               Pageable pageable, BlogQuery blog, Model model){
        model.addAttribute("page",blogService.listBlog(pageable,blog));
        return "admin/blogs::blogList";
    }

    @GetMapping("/blogs/input")
    public String input(Model model){
        model.addAttribute("types",typeService.listType());
        model.addAttribute("tags",tagService.listTag());
        model.addAttribute("blog", new Blog());
        return INPUT;
    }

    @GetMapping("/blogs/{id}/input")
    public String input(@PathVariable Long id, Model model){
        model.addAttribute("types",typeService.listType());
        model.addAttribute("tags",tagService.listTag());
        Blog blog = blogService.getBlog(id);
        blog.init();
        model.addAttribute("blog", blog);
        return INPUT;
    }

    @PostMapping("/blogs")
    public String post(@Valid Blog blog, BindingResult result, HttpSession session, RedirectAttributes attributes, Model model){
        if (blog.getId() == null){
            Blog existBlog = blogService.getBlogByTitle(blog.getTitle());
            if (existBlog != null){
                result.rejectValue("title","titleError","该博客已存在，请勿重复添加");
            }
            if (result.hasErrors()){
                model.addAttribute("types",typeService.listType());
                model.addAttribute("tags",tagService.listTag());
                return "admin/blogs-input";
            }
        }

        String ids = blog.getTagIds();
        List<Tag> tags = new ArrayList<>();
        List<Long> list = new ArrayList<>();
        if (!"".equals(ids) && ids != null){
            String[] idArray = ids.split(",");
            for (int i=0; i < idArray.length; i++){
                for (int j=0; j < idArray[i].length(); j++){
                    if (!Character.isDigit(idArray[i].charAt(j))) {
                        Tag tag = new Tag();
                        tag.setName(idArray[i]);
                        tagService.saveTag(tag);
                        tags.add(tag);
                        break;
                        //list.add(tagService.getTagByName(idArray[i]).getId());
                    }else {
                        Tag tag = tagService.getTag(Long.valueOf(idArray[i]));
                        tags.add(tag);
                        //list.add(Long.valueOf(idArray[i]));
                    }
                }
            }
        }
        blog.setTags(tags);
        blog.setUser((User) session.getAttribute("user"));
        blog.setType(typeService.getType(blog.getType().getId()));

        Blog b = new Blog();
        if (blog.getId() == null){
            b = blogService.saveBlog(blog);
        }else {
            b = blogService.updateBlog(blog.getId(), blog);
        }

        if (b == null){
            attributes.addFlashAttribute("message","操作失败");
        }else{
            attributes.addFlashAttribute("message","操作成功");
        }
        return REDIRECT_LIST;
    }

    @GetMapping("/blogs/{id}/delete")
    public String delete(@PathVariable Long id, RedirectAttributes attributes){
        blogService.deleteBlog(id);
        attributes.addFlashAttribute("message","删除成功");
        return REDIRECT_LIST;
    }

}
