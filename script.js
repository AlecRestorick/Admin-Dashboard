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

    const createDropdownContainer = (className, contentCreator) => {
        const dropdown = document.createElement('div');
        dropdown.classList.add('dropdown-menu', className);
        
        const backdrop = document.createElement('div');
        backdrop.classList.add('dropdown-backdrop');
        
        // Call the content creator function to populate the dropdown
        const content = contentCreator();
        dropdown.appendChild(content);
        
        document.body.appendChild(dropdown);
        document.body.appendChild(backdrop);
        
        return { dropdown, backdrop };
    };

    const searchBtn = document.querySelector('.search-btn');

    const { dropdown: searchDropdown, backdrop: searchBackdrop } = createDropdownContainer('search-dropdown', () => {
        const searchDropdownContainer = document.createElement('div');
        searchDropdownContainer.classList.add('search-dropdown');
        
        const searchInput = document.createElement('input');
        searchInput.type = 'search';
        searchInput.classList.add('search-input');
        searchInput.placeholder = 'Search...';
        
        searchDropdownContainer.appendChild(searchInput);
        return searchDropdownContainer;
    });

    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = searchDropdown.classList.toggle('open');
        if (isOpen) {
            searchDropdown.querySelector('.search-input').focus();
        }
    });

    const notificationBtn = document.querySelector('.notification-btn');

    const notifications = [
        { message: "New message from Name", time: "5 mins ago", icon: 'message-alt' },
        { message: "Project deadline approaching", time: "2 hours ago", icon: 'time' },
        { message: "Team meeting scheduled", time: "Yesterday", icon: 'calendar' }
    ];

    const { dropdown: notificationDropdown, backdrop: notificationBackdrop } = createDropdownContainer('notification-dropdown', () => {
        const notificationContainer = document.createElement('div');
        
        // Notification Header
        const notificationHeader = document.createElement('div');
        notificationHeader.classList.add('notification-header');
        
        const headerTitle = document.createElement('h3');
        headerTitle.textContent = 'Notifications';
        
        const markReadSpan = document.createElement('span');
        markReadSpan.classList.add('mark-read');
        markReadSpan.textContent = 'Mark all as read';
        
        notificationHeader.append(headerTitle, markReadSpan);
        
        // Notification List
        const notificationList = document.createElement('ul');
        notificationList.classList.add('notification-list');
        
        notifications.forEach(note => {
            const listItem = document.createElement('li');
            
            const icon = document.createElement('box-icon');
            icon.setAttribute('name', note.icon);
            icon.classList.add('bx', `bx-${note.icon}`, 'note-icon');
            
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('notification-content');
            
            const messageP = document.createElement('p');
            messageP.textContent = note.message;
            
            const timeSmall = document.createElement('small');
            timeSmall.textContent = note.time;
            
            contentDiv.append(messageP, timeSmall);
            listItem.append(icon, contentDiv);
            notificationList.appendChild(listItem);
        });
        
        // Notification Footer
        const notificationFooter = document.createElement('div');
        notificationFooter.classList.add('notification-footer');
        
        const viewAllLink = document.createElement('a');
        viewAllLink.href = '#';
        viewAllLink.textContent = 'View all notifications';
        
        notificationFooter.appendChild(viewAllLink);
        
        // Assemble all parts
        notificationContainer.append(notificationHeader, notificationList, notificationFooter);
        
        return notificationContainer;
    });

    notificationBtn.addEventListener('click', (e) => {
        e.preventDefault();
        notificationDropdown.classList.toggle('open');
    });

    const shareBtn = document.querySelector('.share-btn');

    const shareOptions = [
        { name: "Copy Link", icon: 'link' },
        { name: "Email", icon: 'envelope' },
        { name: "Share to Teams", icon: 'windows' },
    ];

    const { dropdown: shareDropdown, backdrop: shareBackdrop } = createDropdownContainer('share-dropdown', () => {
        const shareContainer = document.createElement('div');
        shareContainer.classList.add('share-dropdown');
        
        // Share Header
        const shareHeader = document.createElement('div');
        shareHeader.classList.add('share-header');
        
        const headerTitle = document.createElement('h3');
        headerTitle.textContent = 'Share Options';
        
        shareHeader.appendChild(headerTitle);
        
        // Share List
        const shareList = document.createElement('ul');
        shareList.classList.add('share-list');
        
        shareOptions.forEach(option => {
            const listItem = document.createElement('li');
            
            const icon = document.createElement('box-icon');
            icon.setAttribute('name', option.icon);
            icon.classList.add('bx', `bx-${option.icon}`, 'share-icon');
            
            const optionSpan = document.createElement('span');
            optionSpan.classList.add('share-option-text');
            optionSpan.textContent = option.name;
            
            listItem.append(icon, optionSpan);
            shareList.appendChild(listItem);
        });
        
        shareContainer.append(shareHeader, shareList);
        
        return shareContainer;
    });

    shareBtn.addEventListener('click', (e) => {
        e.preventDefault();
        shareDropdown.classList.toggle('open');
    });

    // Global click event listeners to close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        // Search dropdown
        if (!searchBtn.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.classList.remove('open');
        }

        // Notification dropdown
        if (!notificationBtn.contains(e.target) && !notificationDropdown.contains(e.target)) {
            notificationDropdown.classList.remove('open');
        }

        // Share dropdown
        if (!shareBtn.contains(e.target) && !shareDropdown.contains(e.target)) {
            shareDropdown.classList.remove('open');
        }
    });

    // Backdrop click events
    [searchBackdrop, notificationBackdrop, shareBackdrop].forEach(backdrop => {
        backdrop.addEventListener('click', () => {
            searchDropdown.classList.remove('open');
            notificationDropdown.classList.remove('open');
            shareDropdown.classList.remove('open');
        });
    });

    // Responsive handling
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            searchDropdown.classList.remove('open');
            notificationDropdown.classList.remove('open');
            shareDropdown.classList.remove('open');
        }
    });

    // Project Management
    const addBtn = document.querySelector('.add-btn');
    const projectGrid = document.querySelector('.project-grid');

    const generateProjectId = () => {
        return `project-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    };

    const createProjectCard = (title = 'New Project', description = 'Project description placeholder text.') => {
        const projectCard = document.createElement('article');
        projectCard.classList.add('project-card');
        projectCard.setAttribute('data-project-id', generateProjectId());
        
        // Card Header
        const cardHeader = document.createElement('div');
        cardHeader.classList.add('project-card-header');
        
        const titleElement = document.createElement('h3');
        titleElement.contentEditable = 'true';
        titleElement.textContent = title;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-project-btn');
        
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('bx', 'bx-x');
        deleteBtn.appendChild(deleteIcon);
        
        cardHeader.append(titleElement, deleteBtn);
        
        // Description
        const descriptionLabel = document.createElement('h4');
        descriptionLabel.textContent = 'Description:';
        
        const descriptionElement = document.createElement('p');
        descriptionElement.contentEditable = 'true';
        descriptionElement.textContent = description;
        
        projectCard.append(cardHeader, descriptionLabel, descriptionElement);

        deleteBtn.addEventListener('click', () => {
            projectCard.remove();
            saveProjects();
        });

        return projectCard;
    };

    addBtn.addEventListener('click', () => {
        const newProjectCard = createProjectCard();
        projectGrid.appendChild(newProjectCard);

        const newProjectTitle = newProjectCard.querySelector('h3');
        newProjectTitle.focus();

        saveProjects();
    });

    const saveProjects = () => {
        const projects = Array.from(projectGrid.querySelectorAll('.project-card')).map(card => ({
            id: card.getAttribute('data-project-id'),
            title: card.querySelector('h3').textContent,
            description: card.querySelector('p').textContent
        }));
        localStorage.setItem('dashboard-projects', JSON.stringify(projects));
    };

    const loadProjects = () => {
        const savedProjects = JSON.parse(localStorage.getItem('dashboard-projects') || '[]');
        if (savedProjects.length === 0) return;
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