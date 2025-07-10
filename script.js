fetch("/config.json")
	.then((response) => response.json())
	.then((config) => {
		window.siteConfig = config;
		document.dispatchEvent(new CustomEvent("configLoaded"));
	})
	.catch((err) => console.error("Failed to load config: ", err));

class navSection extends HTMLElement {
	connectedCallback() {
		if (window.siteConfig) {
			this.render();
		} else {
			document.addEventListener("configLoaded", () => this.render(), {
				once: true,
			});
		}
	}
	render() {
		const config = window.siteConfig;
		if (!config || !config.navItems) return;

		let navHTML = "";
		config.navItems.forEach((element) => {
			navHTML += `<li><a href="${element.link}">${element.label}</a></li>`;
		});

		const containerHtml = `
        <section class="header-section">
            <p class = "logo">${config.siteName}</p>
            <ul class= "navList">
                ${navHTML}
            </ul>
        </seciton>
        `;
		// Create a temporary element to convert string to nodes
		const temp = document.createElement("div");
		temp.innerHTML = containerHtml;

		// Replace the custom element with the new nodes
		const parent = this.parentNode;
		while (temp.firstChild) {
			parent.insertBefore(temp.firstChild, this);
		}
		parent.removeChild(this);
	}
}

customElements.define("nav-section", navSection);
