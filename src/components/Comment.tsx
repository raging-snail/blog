import { useEffect, useState } from "react"
import { PUBLIC_REMARK_URL } from "astro:env/client";

declare global {
	// Declare the global types for REMARK42 and remark_config so they can be used in this module.
	interface Window {
		REMARK42: any
		remark_config: any
	}
}

// Get the host from the environment variables.
const host = PUBLIC_REMARK_URL
const siteId = "remark";

// Function to get the current URL without the trailing slash
const getCurrentUrl = () => {
  let url = window.location.origin + window.location.pathname;
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  return url;
};

// Function to create or reinitialize Remark42 comments
const createOrReinitializeRemark = (theme: string) => {
  const url = getCurrentUrl();

  if (!window.REMARK42) {
    // If Remark42 is not loaded, insert the script and initialize
    insertScript("comments-script", document.body);
  } else {
    // If Remark42 is already loaded, just reinitialize with new config
    window.REMARK42.destroy();
    window.REMARK42.createInstance({
      host: host,
      site_id: siteId,
      url: url,
      theme: theme,
    });
  }
};

// Function to insert the Remark42 script into the DOM.
const insertScript = (id: string, parentElement: HTMLElement) => {
	const script = window.document.createElement("script")
	script.type = "text/javascript"
	script.async = true
	script.id = id

	// Get the current URL, and remove trailing slash if it exists.
	const url = getCurrentUrl();

  // Get Blog theme from local storage
  let theme = window.localStorage.getItem('theme') || 'light'
	// Set the inner HTML of the script to load Remark42.
	script.innerHTML = `
    var remark_config = {
      host: "${host}",
      site_id: "${siteId}",
      url: "${url}",
      theme: "${theme}",
      components: ["counter", "embed"],
    };
    !function(e,n){for(var o=0;o<e.length;o++){var r=n.createElement("script"),c=".js",d=n.head||n.body;"noModule"in r?(r.type="module",c=".mjs"):r.async=!0,r.defer=!0,r.src=remark_config.host+"/web/"+e[o]+c,d.appendChild(r)}}(remark_config.components||["embed"],document);`

	// Append the script to the parent element.
	parentElement.appendChild(script)
}

// Function to remove the Remark42 script from the DOM.
const removeScript = (id: string, parentElement: HTMLElement) => {
	const script = window.document.getElementById(id)
	if (script) {
		parentElement.removeChild(script)
	}
}

export function Comments() {
	// State for tracking the current theme.
	const [theme, setTheme] = useState(() => window.localStorage.getItem("theme") || "light")

	// Effect to handle theme changes and URL changes
  useEffect(() => {
    createOrReinitializeRemark(theme);

    return () => {
      // Cleanup by removing the script when the component unmounts
      removeScript("comments-script", document.body);
    };
  }, [theme, window.location.href]); // Depend on theme and URL to trigger reinitialization

	// 监听 localStorage 中主题的变化
  useEffect(() => {
     // 监听 theme-change 事件来切换评论区主题
		 const handleThemeChange = () => {
      const newTheme = window.localStorage.getItem('theme') || 'light';
      setTheme(newTheme);
    };

    window.addEventListener('theme-change', handleThemeChange);

    return () => {
      window.removeEventListener('theme-change', handleThemeChange);
    };
  }, [theme]);

	// Use effect to update the theme when it changes.
	useEffect(() => {
		if (window.REMARK42) {
			window.REMARK42.changeTheme(theme)
		}
	}, [theme])

	return (
		<>
			<div className="mt-10 mb-5 border-t-2 pt-3">
        <span className="text-2xl pr-1 font-extralight">Comments</span>
        <span className="counter align-super font-bold">
          <span className="remark42__counter"></span>
        </span>
      </div>
      <div id="remark42"></div>
		</>
	)
}