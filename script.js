const defaultPrompts = [
    {
        id: 1,
        title: "Modern Website Landing Page",
        category: "Design",
        text: `Create a modern, responsive and visually impressive landing page for a technology company.

Use a clean white layout, modern typography, smooth animations, interactive sections and a professional SaaS-style design.

Include:
- Hero section
- Features
- Services
- Testimonials
- Pricing
- FAQ
- Call-to-action
- Footer

Make the design responsive for desktop, tablet and mobile.`,
        tags: ["Website", "UI", "Landing Page"],
        favorite: true,
        date: "Sep 29, 2026"
    },

    {
        id: 2,
        title: "JavaScript Code Reviewer",
        category: "Coding",
        text: `Act as an expert JavaScript developer.

Review the following JavaScript code carefully.

Identify:
1. Syntax errors
2. Logical errors
3. Performance issues
4. Security concerns
5. Poor coding practices

Then provide the corrected code and explain each important change clearly.`,
        tags: ["JavaScript", "Code", "Developer"],
        favorite: true,
        date: "Sep 28, 2026"
    },

    {
        id: 3,
        title: "Social Media Campaign",
        category: "Marketing",
        text: `Create a complete social media marketing campaign for a digital marketing agency.

Target audience:
- Startups
- Small businesses
- Entrepreneurs

Include:
- Campaign concept
- 10 post ideas
- 5 Reel ideas
- Captions
- Hooks
- CTAs
- Hashtags

Keep the content modern, engaging and conversion-focused.`,
        tags: ["Marketing", "Social Media", "Campaign"],
        favorite: false,
        date: "Sep 27, 2026"
    },

    {
        id: 4,
        title: "Professional LinkedIn Post",
        category: "Writing",
        text: `Write a professional LinkedIn post about completing a new technology certification.

The post should:
- Start with an engaging hook
- Mention what I learned
- Explain how the knowledge will help my career
- Sound authentic and professional
- End with a short positive statement

Keep it concise and suitable for LinkedIn.`,
        tags: ["LinkedIn", "Content", "Career"],
        favorite: false,
        date: "Sep 26, 2026"
    },

    {
        id: 5,
        title: "Startup Business Idea",
        category: "Business",
        text: `Act as a startup consultant.

Generate a unique technology startup idea that solves a real-world problem.

Provide:
- Problem statement
- Target audience
- Solution
- Core features
- Revenue model
- Marketing strategy
- Technology stack
- Future scalability

Focus on an idea that can realistically be developed by a small startup team.`,
        tags: ["Startup", "Business", "Strategy"],
        favorite: true,
        date: "Sep 25, 2026"
    },

    {
        id: 6,
        title: "AI Product Description",
        category: "Marketing",
        text: `Write a compelling product description for an AI-powered SaaS product.

The description should clearly communicate:
- The problem it solves
- Key benefits
- Main features
- Why users should choose it

Use simple language, persuasive copy and a strong call-to-action.`,
        tags: ["AI", "SaaS", "Copywriting"],
        favorite: false,
        date: "Sep 24, 2026"
    }
];


/* ================= STATE ================= */

let prompts =
    JSON.parse(
        localStorage.getItem("kaveshPrompts")
    ) || defaultPrompts;

let copiedCount =
    Number(
        localStorage.getItem("kaveshCopied")
    ) || 0;

let currentCategory = "All";

let currentViewPrompt = null;


/* ================= ELEMENTS ================= */

const promptGrid =
    document.getElementById("promptGrid");

const allPromptGrid =
    document.getElementById("allPromptGrid");

const favoriteGrid =
    document.getElementById("favoriteGrid");

const categoryCards =
    document.getElementById("categoryCards");

const searchInput =
    document.getElementById("searchInput");

const modalOverlay =
    document.getElementById("modalOverlay");

const viewModalOverlay =
    document.getElementById("viewModalOverlay");

const promptForm =
    document.getElementById("promptForm");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* ================= SAVE DATA ================= */

function saveData() {

    localStorage.setItem(
        "kaveshPrompts",
        JSON.stringify(prompts)
    );

    localStorage.setItem(
        "kaveshCopied",
        copiedCount
    );
}


/* ================= INITIALIZE ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderAll();

        setupNavigation();

        setupFilters();

        setupModal();

        setupSearch();

        setupMobileMenu();

        setupKeyboardShortcut();

    }
);


/* ================= RENDER EVERYTHING ================= */

function renderAll() {

    updateStats();

    renderDashboard();

    renderAllPrompts();

    renderFavorites();

    renderCategories();

}


/* ================= STATISTICS ================= */

function updateStats() {

    document.getElementById(
        "totalPrompts"
    ).textContent = prompts.length;


    document.getElementById(
        "favoriteCount"
    ).textContent =
        prompts.filter(
            prompt => prompt.favorite
        ).length;


    const categories =
        new Set(
            prompts.map(
                prompt => prompt.category
            )
        );

    document.getElementById(
        "categoryCount"
    ).textContent =
        categories.size;


    document.getElementById(
        "copiedCount"
    ).textContent =
        copiedCount;
}


/* ================= DASHBOARD ================= */

function renderDashboard() {

    let filtered =
        filterPrompts(
            prompts,
            currentCategory
        );

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();

    if (searchTerm) {

        filtered =
            filtered.filter(
                prompt =>
                    prompt.title
                        .toLowerCase()
                        .includes(searchTerm) ||

                    prompt.text
                        .toLowerCase()
                        .includes(searchTerm) ||

                    prompt.category
                        .toLowerCase()
                        .includes(searchTerm) ||

                    prompt.tags.some(
                        tag =>
                            tag
                                .toLowerCase()
                                .includes(searchTerm)
                    )
            );
    }


    /*
        Dashboard shows latest 6 prompts.
    */

    renderPromptCards(
        promptGrid,
        filtered.slice(0, 6)
    );
}


/* ================= ALL PROMPTS ================= */

function renderAllPrompts() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    let filtered = [...prompts];


    if (searchTerm) {

        filtered =
            filtered.filter(
                prompt =>
                    prompt.title
                        .toLowerCase()
                        .includes(searchTerm) ||

                    prompt.text
                        .toLowerCase()
                        .includes(searchTerm) ||

                    prompt.category
                        .toLowerCase()
                        .includes(searchTerm) ||

                    prompt.tags.some(
                        tag =>
                            tag
                                .toLowerCase()
                                .includes(searchTerm)
                    )
            );
    }


    renderPromptCards(
        allPromptGrid,
        filtered
    );
}


/* ================= FAVORITES ================= */

function renderFavorites() {

    const favorites =
        prompts.filter(
            prompt => prompt.favorite
        );

    renderPromptCards(
        favoriteGrid,
        favorites
    );
}


/* ================= CATEGORY PAGE ================= */

function renderCategories() {

    const categoryMap = {};

    prompts.forEach(
        prompt => {

            if (
                !categoryMap[
                    prompt.category
                ]
            ) {

                categoryMap[
                    prompt.category
                ] = 0;
            }

            categoryMap[
                prompt.category
            ]++;

        }
    );


    categoryCards.innerHTML = "";


    Object.entries(categoryMap)
        .forEach(
            ([category, count]) => {

                const card =
                    document.createElement("div");

                card.className =
                    "category-card";

                card.innerHTML = `

                    <div class="category-card-icon">
                        #
                    </div>

                    <h3>
                        ${escapeHTML(category)}
                    </h3>

                    <p>
                        ${count}
                        ${count === 1
                            ? "prompt"
                            : "prompts"}
                    </p>

                `;


                card.addEventListener(
                    "click",
                    () => {

                        currentCategory =
                            category;

                        updateFilterButtons();

                        showSection(
                            "dashboard"
                        );

                        renderDashboard();

                    }
                );


                categoryCards.appendChild(card);

            }
        );


    if (
        Object.keys(categoryMap).length === 0
    ) {

        categoryCards.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">#</div>
                <h3>No categories yet</h3>
                <p>Create your first prompt to add a category.</p>
            </div>
        `;
    }
}


/* ================= FILTER PROMPTS ================= */

function filterPrompts(
    promptList,
    category
) {

    if (category === "All") {
        return [...promptList];
    }

    return promptList.filter(
        prompt =>
            prompt.category === category
    );
}


/* ================= PROMPT CARDS ================= */

function renderPromptCards(
    container,
    promptList
) {

    container.innerHTML = "";


    if (promptList.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ✦
                </div>

                <h3>
                    No prompts found
                </h3>

                <p>
                    Try changing your search or create a new prompt.
                </p>

            </div>

        `;

        return;
    }


    promptList.forEach(
        prompt => {

            const card =
                document.createElement("article");

            card.className =
                "prompt-card";


            const tagsHTML =
                prompt.tags
                    .slice(0, 3)
                    .map(
                        tag =>
                            `<span class="tag">
                                ${escapeHTML(tag)}
                            </span>`
                    )
                    .join("");


            card.innerHTML = `

                <div class="prompt-card-top">

                    <span class="prompt-category">
                        ${escapeHTML(prompt.category)}
                    </span>

                    <button
                        class="favorite-btn
                        ${prompt.favorite
                            ? "active"
                            : ""}"
                        data-action="favorite"
                        data-id="${prompt.id}"
                        title="Favorite"
                    >
                        ${prompt.favorite
                            ? "★"
                            : "☆"}
                    </button>

                </div>


                <h3>
                    ${escapeHTML(prompt.title)}
                </h3>


                <p class="prompt-preview">
                    ${escapeHTML(prompt.text)}
                </p>


                <div class="prompt-tags">
                    ${tagsHTML}
                </div>


                <div class="card-footer">

                    <span class="card-date">
                        ${escapeHTML(prompt.date)}
                    </span>

                    <div class="card-actions">

                        <button
                            class="card-action"
                            data-action="view"
                            data-id="${prompt.id}"
                            title="View"
                        >
                            View
                        </button>

                        <button
                            class="card-action"
                            data-action="copy"
                            data-id="${prompt.id}"
                            title="Copy"
                        >
                            Copy
                        </button>

                        <button
                            class="card-action"
                            data-action="edit"
                            data-id="${prompt.id}"
                            title="Edit"
                        >
                            Edit
                        </button>

                        <button
                            class="card-action delete"
                            data-action="delete"
                            data-id="${prompt.id}"
                            title="Delete"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            `;


            container.appendChild(card);

        }
    );
}


/* ================= CARD ACTIONS ================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-action]"
            );


        if (!button) return;


        const id =
            Number(button.dataset.id);

        const action =
            button.dataset.action;


        const prompt =
            prompts.find(
                item => item.id === id
            );


        if (!prompt) return;


        if (action === "favorite") {

            toggleFavorite(id);

        }


        if (action === "copy") {

            copyPrompt(prompt);

        }


        if (action === "view") {

            openViewModal(prompt);

        }


        if (action === "edit") {

            openEditModal(prompt);

        }


        if (action === "delete") {

            deletePrompt(id);

        }

    }
);


/* ================= FAVORITE ================= */

function toggleFavorite(id) {

    const prompt =
        prompts.find(
            item => item.id === id
        );

    if (!prompt) return;


    prompt.favorite =
        !prompt.favorite;


    saveData();

    renderAll();

    showToast(
        prompt.favorite
            ? "Added to favorites"
            : "Removed from favorites"
    );
}


/* ================= COPY PROMPT ================= */

async function copyPrompt(prompt) {

    try {

        await navigator.clipboard.writeText(
            prompt.text
        );


        copiedCount++;

        saveData();

        updateStats();

        showToast(
            "Prompt copied to clipboard!"
        );

    } catch (error) {

        /*
            Fallback for older browsers.
        */

        const textarea =
            document.createElement("textarea");

        textarea.value =
            prompt.text;

        document.body.appendChild(
            textarea
        );

        textarea.select();

        document.execCommand("copy");

        textarea.remove();


        copiedCount++;

        saveData();

        updateStats();

        showToast(
            "Prompt copied!"
        );
    }
}


/* ================= DELETE ================= */

function deletePrompt(id) {

    const prompt =
        prompts.find(
            item => item.id === id
        );


    if (!prompt) return;


    const confirmed =
        confirm(
            `Delete "${prompt.title}"?`
        );


    if (!confirmed) return;


    prompts =
        prompts.filter(
            item => item.id !== id
        );


    saveData();

    renderAll();

    showToast(
        "Prompt deleted"
    );
}


/* ================= MODAL ================= */

function setupModal() {

    document
        .getElementById("openModalBtn")
        .addEventListener(
            "click",
            () => openCreateModal()
        );


    document
        .getElementById("openModalBtn2")
        .addEventListener(
            "click",
            () => openCreateModal()
        );


    document
        .getElementById("closeModal")
        .addEventListener(
            "click",
            closeCreateModal
        );


    document
        .getElementById("cancelModal")
        .addEventListener(
            "click",
            closeCreateModal
        );


    modalOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modalOverlay
            ) {

                closeCreateModal();

            }

        }
    );


    promptForm.addEventListener(
        "submit",
        handlePromptSubmit
    );
}


/* ================= CREATE MODAL ================= */

function openCreateModal() {

    promptForm.reset();

    document.getElementById(
        "editPromptId"
    ).value = "";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Create New Prompt";


    modalOverlay.classList.add(
        "show"
    );


    setTimeout(
        () => {
            document
                .getElementById("promptTitle")
                .focus();
        },
        100
    );
}


/* ================= EDIT MODAL ================= */

function openEditModal(prompt) {

    document.getElementById(
        "editPromptId"
    ).value =
        prompt.id;


    document.getElementById(
        "promptTitle"
    ).value =
        prompt.title;


    document.getElementById(
        "promptCategory"
    ).value =
        prompt.category;


    document.getElementById(
        "promptText"
    ).value =
        prompt.text;


    document.getElementById(
        "promptTags"
    ).value =
        prompt.tags.join(", ");


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Prompt";


    modalOverlay.classList.add(
        "show"
    );
}


/* ================= CLOSE MODAL ================= */

function closeCreateModal() {

    modalOverlay.classList.remove(
        "show"
    );

    promptForm.reset();
}


/* ================= FORM SUBMIT ================= */

function handlePromptSubmit(event) {

    event.preventDefault();


    const editId =
        document.getElementById(
            "editPromptId"
        ).value;


    const title =
        document.getElementById(
            "promptTitle"
        ).value.trim();


    const category =
        document.getElementById(
            "promptCategory"
        ).value;


    const text =
        document.getElementById(
            "promptText"
        ).value.trim();


    const tags =
        document.getElementById(
            "promptTags"
        ).value
            .split(",")
            .map(
                tag => tag.trim()
            )
            .filter(Boolean);


    if (
        !title ||
        !category ||
        !text
    ) {

        showToast(
            "Please fill all required fields"
        );

        return;
    }


    if (editId) {

        const prompt =
            prompts.find(
                item =>
                    item.id ===
                    Number(editId)
            );


        if (prompt) {

            prompt.title =
                title;

            prompt.category =
                category;

            prompt.text =
                text;

            prompt.tags =
                tags;

        }


        showToast(
            "Prompt updated successfully!"
        );

    } else {

        const newPrompt = {

            id:
                Date.now(),

            title,

            category,

            text,

            tags,

            favorite: false,

            date:
                new Date()
                    .toLocaleDateString(
                        "en-US",
                        {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                        }
                    )

        };


        prompts.unshift(
            newPrompt
        );


        showToast(
            "Prompt created successfully!"
        );
    }


    saveData();

    renderAll();

    closeCreateModal();
}


/* ================= VIEW MODAL ================= */

function openViewModal(prompt) {

    currentViewPrompt =
        prompt;


    document.getElementById(
        "viewCategory"
    ).textContent =
        prompt.category;


    document.getElementById(
        "viewTitle"
    ).textContent =
        prompt.title;


    document.getElementById(
        "viewPrompt"
    ).textContent =
        prompt.text;


    document.getElementById(
        "viewTags"
    ).innerHTML =
        prompt.tags
            .map(
                tag =>
                    `<span class="tag">
                        ${escapeHTML(tag)}
                    </span>`
            )
            .join("");


    viewModalOverlay.classList.add(
        "show"
    );
}


/* ================= VIEW MODAL CONTROLS ================= */

document
    .getElementById("closeViewModal")
    .addEventListener(
        "click",
        () => {

            viewModalOverlay.classList.remove(
                "show"
            );

        }
    );


document
    .getElementById("viewCopyBtn")
    .addEventListener(
        "click",
        () => {

            if (
                currentViewPrompt
            ) {

                copyPrompt(
                    currentViewPrompt
                );

            }

        }
    );


document
    .getElementById("viewEditBtn")
    .addEventListener(
        "click",
        () => {

            if (
                currentViewPrompt
            ) {

                viewModalOverlay.classList.remove(
                    "show"
                );

                openEditModal(
                    currentViewPrompt
                );

            }

        }
    );


viewModalOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            viewModalOverlay
        ) {

            viewModalOverlay.classList.remove(
                "show"
            );

        }

    }
);


/* ================= NAVIGATION ================= */

function setupNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item[data-section]"
        );


    navItems.forEach(
        item => {

            item.addEventListener(
                "click",
                () => {

                    const section =
                        item.dataset.section;


                    navItems.forEach(
                        nav =>
                            nav.classList.remove(
                                "active"
                            )
                    );


                    item.classList.add(
                        "active"
                    );


                    showSection(
                        section
                    );

                }
            );

        }
    );


    document
        .getElementById("viewAllBtn")
        .addEventListener(
            "click",
            () => {

                showSection(
                    "prompts"
                );

                navItems.forEach(
                    nav =>
                        nav.classList.remove(
                            "active"
                        )
                );


                document
                    .querySelector(
                        '[data-section="prompts"]'
                    )
                    .classList.add(
                        "active"
                    );

            }
        );
}


/* ================= SHOW SECTION ================= */

function showSection(section) {

    document
        .querySelectorAll(".page-section")
        .forEach(
            page =>
                page.classList.remove(
                    "active-section"
                )
        );


    const target =
        document.getElementById(
            `${section}Section`
        );


    if (target) {

        target.classList.add(
            "active-section"
        );

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ================= FILTERS ================= */

function setupFilters() {

    document
        .querySelectorAll(".filter-btn")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        currentCategory =
                            button.dataset.category;


                        updateFilterButtons();

                        renderDashboard();

                    }
                );

            }
        );
}


/* ================= UPDATE FILTER BUTTONS ================= */

function updateFilterButtons() {

    document
        .querySelectorAll(".filter-btn")
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.category ===
                        currentCategory
                );

            }
        );
}


/* ================= SEARCH ================= */

function setupSearch() {

    searchInput.addEventListener(
        "input",
        () => {

            renderDashboard();

            renderAllPrompts();

        }
    );
}


/* ================= MOBILE MENU ================= */

function setupMobileMenu() {

    document
        .getElementById("mobileMenu")
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById("sidebar")
                    .classList.toggle(
                        "open"
                    );

            }
        );


    document
        .querySelectorAll(".nav-item")
        .forEach(
            item => {

                item.addEventListener(
                    "click",
                    () => {

                        if (
                            window.innerWidth <=
                            800
                        ) {

                            document
                                .getElementById(
                                    "sidebar"
                                )
                                .classList.remove(
                                    "open"
                                );

                        }

                    }
                );

            }
        );
}


/* ================= KEYBOARD SHORTCUT ================= */

function setupKeyboardShortcut() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                (event.ctrlKey ||
                    event.metaKey) &&
                event.key.toLowerCase() ===
                    "k"
            ) {

                event.preventDefault();

                searchInput.focus();

            }


            if (
                event.key === "Escape"
            ) {

                modalOverlay.classList.remove(
                    "show"
                );

                viewModalOverlay.classList.remove(
                    "show"
                );

            }

        }
    );
}


/* ================= TOAST ================= */

function showToast(message) {

    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );
}


/* ================= SECURITY ================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}