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
			navHTML += `<li><a href="${element.link}" target="${
				element.target ?? "_self"
			}">${element.label}</a></li>`;
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

class footerSection extends HTMLElement {
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

		let footerNavHtml = "";
		config.navItems.forEach((element) => {
			footerNavHtml += `<p class="footer-body"><a href="${
				element.link
			}" target=${element.target ?? "_self"}>${element.label}</a></p>`;
		});

		const containerHtml = `
			<section class="footer" id="footer">
			<img src="assets/footer-bg-cropped.webp" alt="footer-bg-cropped" />
			<div class="footer-texts">
				<div class="footer-1">
					<p class="footer-logo">${config.siteName}</p>
				</div>
				<div class="footer-2">
					<p class="footer-head">About Us</p>
					<p class="footer-body">Phone: ${config.phone}</p>
					<p class="footer-body">Email: ${config.email}</p>
					<p class="footer-body">
						Address: ${config.address}
					</p>
				</div>
                <div class="footer-3">
					<p class="footer-head">Explore More</p>
                    ${footerNavHtml}
                </div>
			</div>
		</section>
		`;

		let temp = document.createElement("div");
		temp.innerHTML = containerHtml;

		const parent = this.parentNode;
		while (temp.firstChild) {
			parent.insertBefore(temp.firstChild, this);
		}
		parent.removeChild(this);
	}
}

customElements.define("footer-section", footerSection);

class normalItemList extends HTMLElement {
	connectedCallback() {
		this.type = this.getAttribute("type");
		if (window.siteConfig) {
			this.render();
		} else {
			document.addEventListener("configLoaded", () => this.render(), {
				once: true,
			});
		}
	}

	render() {
		console.log("Loading the item list for: ", this.type);
		const config = window.siteConfig;
		if (!config) return;

		const heading = config.headings[this.type];

		let itemsHtml = "";
		config.items[this.type].forEach((item) => {
			itemsHtml += `
				<div class="item">
					<img
						src="${item.image}"
						alt="${item.description}"
					/>
					<p class="item-name">${item.description}</p>
					<p class="item-price">Rs. ${item.price}.00</p>
					<p class="availability ${item.availability ? "" : "out"}">${
				item.availability ? "In Stock" : "Out of Stock"
			}</p>
					<button>Make it mine</button>
				</div>
			`;
		});

		const containerHtml = `
			<section class="${this.type}" id="${this.type}">
				<p class="section-head">${heading}</p>
				<div class="items">
					${itemsHtml}
				</div>
			</section>
		`;

		let temp = document.createElement("div");
		temp.innerHTML = containerHtml;
		const parent = this.parentNode;
		while (temp.firstChild) {
			parent.insertBefore(temp.firstChild, this);
		}
		parent.removeChild(this);
	}
}

customElements.define("normal-item-section", normalItemList);
