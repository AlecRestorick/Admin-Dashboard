document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const navSidebar = document.getElementById('nav-sidebar');
    const sidebarBackdrop = document.querySelector('.sidebar-backdrop');
    
    menuBtn.addEventListener('click', () => {
        const isOpen = navSidebar.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', isOpen.toString());
        menuBtn.setAttribute('aria-controls', 'nav-sidebar');
    });

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', () => {
            navSidebar.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
        });
    }

    const createDropdownContainer = (className, content) => {
        const dropdown = document.createElement('div');
        dropdown.classList.add('dropdown-menu', className);
        dropdown.innerHTML = content;
        
        const backdrop = document.createElement('div');
        backdrop.classList.add('dropdown-backdrop');
        
        document.body.appendChild(dropdown);
        document.body.appendChild(backdrop);
        
        return { dropdown, backdrop };
    };

    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');

    const { dropdown: searchDropdown, backdrop: searchBackdrop } = createDropdownContainer('search-dropdown', `
        <div class="search-dropdown">
            <input type="search" class="search-input" placeholder="Search...">
        </div>
    `);

    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = searchDropdown.classList.toggle('open');
        if (isOpen) {
            searchDropdown.querySelector('.search-input').focus();
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchBtn.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.classList.remove('open');
        }
    });

    const notificationBtn = document.querySelector('.notification-btn');

    const notifications = [
        { message: "New message from Name", time: "5 mins ago", icon: 'message-alt' },
        { message: "Project deadline approaching", time: "2 hours ago", icon: 'time' },
        { message: "Team meeting scheduled", time: "Yesterday", icon: 'calendar' }
    ];

    const { dropdown: notificationDropdown, backdrop: notificationBackdrop } = createDropdownContainer('notification-dropdown', `
        <div class="notification-header">
            <h3>Notifications</h3>
            <span class="mark-read">Mark all as read</span>
        </div>
        <ul class="notification-list">
            ${notifications.map(note => `
                <li>
                    <box-icon name="${note.icon}" class="bx bx-${note.icon} note-icon"></box-icon>
                    <div class="notification-content">
                        <p>${note.message}</p>
                        <small>${note.time}</small>
                    </div>
                </li>
            `).join('')}
        </ul>
        <div class="notification-footer">
            <a href="#">View all notifications</a>
        </div>
    `);

    notificationBtn.addEventListener('click', (e) => {
        e.preventDefault();
        notificationDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!notificationBtn.contains(e.target) && !notificationDropdown.contains(e.target)) {
            notificationDropdown.classList.remove('open');
        }
    });

    const shareBtn = document.querySelector('.share-btn');

    const shareOptions = [
        { name: "Copy Link", icon: 'link' },
        { name: "Email", icon: 'envelope' },
        { name: "Share to Teams", icon: 'windows' },
    ];

    const { dropdown: shareDropdown, backdrop: shareBackdrop } = createDropdownContainer('share-dropdown', `
        <div class="share-dropdown">
            <div class="share-header">
                <h3>Share Options</h3>
            </div>
            <ul class="share-list">
                ${shareOptions.map(option => `
                    <li>
                        <box-icon name="${option.icon}" class="bx bx-${option.icon} share-icon"></box-icon>
                        <span class="share-option-text">${option.name}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `);

    

    shareBtn.addEventListener('click', (e) => {
        e.preventDefault();
        shareDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!shareBtn.contains(e.target) && !shareDropdown.contains(e.target)) {
            shareDropdown.classList.remove('open');
        }
    });


    [searchBackdrop, notificationBackdrop, shareBackdrop].forEach(backdrop => {
        backdrop.addEventListener('click', () => {
            searchDropdown.classList.remove('open');
            notificationDropdown.classList.remove('open');
            shareDropdown.classList.remove('open');
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            searchDropdown.classList.remove('open');
            notificationDropdown.classList.remove('open');
            shareDropdown.classList.remove('open');
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.querySelector('.add-btn');
    const projectGrid = document.querySelector('.project-grid');

    const generateProjectId = () => {
        return `project-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    };

    const createProjectCard = (title = 'New Project', description = 'Project description placeholder text.') => {
        const projectCard = document.createElement('article');
        projectCard.classList.add('project-card');
        projectCard.setAttribute('data-project-id', generateProjectId());
        projectCard.innerHTML = `
            <div class="project-card-header">
                <h3 contenteditable="true">${title}</h3>
                <button class="delete-project-btn">
                    <i class='bx bx-x'></i>
                </button>
            </div>
            <h4>Description:</h4>
            <p contenteditable="true">${description}</p>
        `;

        const deleteBtn = projectCard.querySelector('.delete-project-btn');
        deleteBtn.addEventListener('click', () => {
            projectCard.remove();
            saveProjects();
        });

        return projectCard;
    };

    addBtn.addEventListener('click', () => {
        const newProjectCard = createProjectCard();
        projectGrid.appendChild(newProjectCard);

        const newProjectTitle = newProjectCard.querySelector('h2');
        newProjectTitle.focus();

        saveProjects();
    });

    const saveProjects = () => {
        const projects = Array.from(projectGrid.querySelectorAll('.project-card')).map(card => ({
            id: card.getAttribute('data-project-id'),
            title: card.querySelector('h2').textContent,
            description: card.querySelector('p').textContent
        }));
        localStorage.setItem('dashboard-projects', JSON.stringify(projects));
    };

    const loadProjects = () => {
        const savedProjects = JSON.parse(localStorage.getItem('dashboard-projects') || '[]');
        if (savedProjects.length === 0) return; // Do nothing if there are no saved projects.
        savedProjects.forEach(project => {
            const projectCard = createProjectCard(project.title, project.description);
            projectCard.setAttribute('data-project-id', project.id);
            projectGrid.appendChild(projectCard);
        });
    };

    loadProjects();

    projectGrid.addEventListener('input', saveProjects);
    projectGrid.addEventListener('click', saveProjects);
});

