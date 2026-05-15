import React, { useEffect, useState } from 'react';
import {
  Layout,
  Menu,
  Typography,
  Avatar,
  Dropdown,
  Space,
  Button,
  Input,
  Tabs,
  Modal,
  message,
  AutoComplete,
  Card,
  Tag,
  Upload,
  type TabsProps,
} from 'antd';

import {
  FileTextOutlined,
  BugOutlined,
  CheckSquareOutlined,
  AuditOutlined,
  LinkOutlined,
  FolderOpenOutlined,
  UserOutlined,
  DownOutlined,
  PlusOutlined,
  TeamOutlined,
  CrownOutlined,
  DeleteOutlined,
  LogoutOutlined,
  CopyOutlined,
  CloseOutlined,
  EyeInvisibleOutlined,
  RollbackOutlined,
  UploadOutlined,
  EditOutlined,
  InboxOutlined,
  DownloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';

import logo from './assets/logo.png';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

type UserRole = 'admin' | 'user';
type SourceType = 'file' | 'text';

type Account = {
  id: string;
  name: string;
  password: string;
};

type ProjectUser = {
  id: string;
  name: string;
  role: UserRole;
};

type Project = {
  id: string;
  name: string;
  users: ProjectUser[];
  inviteLink: string;
};

type SourceItem = {
  id: string;
  projectId: string;
  name: string;
  type: SourceType;
  content?: string;
  file?: File;
  filePreviewUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  isHidden: boolean;
  hiddenById?: string;
  hiddenByName?: string;
};

type LinkItem = {
  id: string;
  projectId: string;
  name: string;
  url: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  isHidden: boolean;
  hiddenById?: string;
  hiddenByName?: string;
};

const initialAccounts: Account[] = [
  { id: 'user-1', name: 'Иванов И. И.', password: '1234' },
  { id: 'user-2', name: 'Петров П. П.', password: '1234' },
  { id: 'user-3', name: 'Сидоров С. С.', password: '1234' },
  { id: 'user-4', name: 'Смирнов А. А.', password: '1234' },
];

const initialProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Система тестирования',
    inviteLink: 'http://localhost:3000/join/project/project-1-token',
    users: [
      { id: 'user-1', name: 'Иванов И. И.', role: 'admin' },
      { id: 'user-2', name: 'Петров П. П.', role: 'user' },
      { id: 'user-3', name: 'Сидоров С. С.', role: 'user' },
    ],
  },
  {
    id: 'project-2',
    name: 'Модуль баг-репортов',
    inviteLink: 'http://localhost:3000/join/project/project-2-token',
    users: [
      { id: 'user-4', name: 'Смирнов А. А.', role: 'admin' },
      { id: 'user-1', name: 'Иванов И. И.', role: 'user' },
    ],
  },
];

const initialSources: SourceItem[] = [
  {
    id: 'source-1',
    projectId: 'project-1',
    name: 'Техническое задание',
    type: 'text',
    content: 'Основное техническое задание проекта.',
    authorId: 'user-1',
    authorName: 'Иванов И. И.',
    createdAt: '15.05.2026',
    isHidden: false,
  },
  {
    id: 'source-2',
    projectId: 'project-1',
    name: 'Макет интерфейса',
    type: 'file',
    fileName: 'interface-layout.png',
    fileSize: 325000,
    fileType: 'image/png',
    authorId: 'user-2',
    authorName: 'Петров П. П.',
    createdAt: '15.05.2026',
    isHidden: false,
  },
];

const initialLinks: LinkItem[] = [
  {
    id: 'link-1',
    projectId: 'project-1',
    name: 'YouTrack',
    url: 'https://www.jetbrains.com/youtrack/',
    authorId: 'user-1',
    authorName: 'Иванов И. И.',
    createdAt: '15.05.2026',
    isHidden: false,
  },
  {
    id: 'link-2',
    projectId: 'project-1',
    name: 'Figma',
    url: 'https://www.figma.com/',
    authorId: 'user-1',
    authorName: 'Иванов И. И.',
    createdAt: '15.05.2026',
    isHidden: false,
  },
];

const App: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [allProjects, setAllProjects] = useState<Project[]>(initialProjects);
  const [sources, setSources] = useState<SourceItem[]>(initialSources);
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);

  const [currentUser, setCurrentUser] = useState<Account | null>(null);

  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [isAccountModalVisible, setIsAccountModalVisible] = useState(true);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [registerName, setRegisterName] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [isEditNameModalVisible, setIsEditNameModalVisible] = useState(false);
  const [editName, setEditName] = useState('');

  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedMenuKey, setSelectedMenuKey] = useState<string>('1');

  const [isProjectActionModalVisible, setIsProjectActionModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);

  const [newProjectName, setNewProjectName] = useState('');
  const [joinProjectLink, setJoinProjectLink] = useState('');

  const [isTextSourceModalVisible, setIsTextSourceModalVisible] = useState(false);
  const [isFileSourceModalVisible, setIsFileSourceModalVisible] = useState(false);
  const [sourceName, setSourceName] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [selectedSourceFile, setSelectedSourceFile] = useState<File | null>(null);

  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [previewSource, setPreviewSource] = useState<SourceItem | null>(null);

  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const userProjects = currentUser
    ? allProjects.filter((project) =>
        project.users.some((user) => user.id === currentUser.id)
      )
    : [];

  const activeProject =
    userProjects.find((project) => project.id === activeProjectId) || userProjects[0];

  const currentUserProjectRole: UserRole =
    activeProject?.users.find((user) => user.id === currentUser?.id)?.role || 'user';

  const isAdmin = currentUserProjectRole === 'admin';

  const activeProjectSources = activeProject
    ? sources.filter((source) => {
        if (source.projectId !== activeProject.id) return false;
        if (isAdmin) return true;
        return !source.isHidden;
      })
    : [];

  const activeProjectLinks = activeProject
    ? links.filter((link) => {
        if (link.projectId !== activeProject.id) return false;
        if (isAdmin) return true;
        return !link.isHidden;
      })
    : [];

  useEffect(() => {
    if (userProjects.length > 0 && !userProjects.some((project) => project.id === activeProjectId)) {
      setActiveProjectId(userProjects[0].id);
    }

    if (userProjects.length === 0) {
      setActiveProjectId('');
    }
  }, [currentUser, allProjects, activeProjectId]);

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('ru-RU');
  };

  const formatFileSize = (size?: number) => {
    if (!size) return 'Не указан';

    if (size < 1024) return size + ' Б';
    if (size < 1024 * 1024) return Math.round(size / 1024) + ' КБ';

    return (size / 1024 / 1024).toFixed(2) + ' МБ';
  };

  const normalizeUrl = (url: string) => {
    const trimmedUrl = url.trim();

    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return trimmedUrl;
    }

    return 'https://' + trimmedUrl;
  };

  const handleLogin = () => {
    const foundAccount = accounts.find(
      (account) =>
        account.name === loginName.trim() &&
        account.password === loginPassword.trim()
    );

    if (!foundAccount) {
      message.error('Неверное имя пользователя или пароль');
      return;
    }

    setCurrentUser(foundAccount);
    setLoginName('');
    setLoginPassword('');
    setIsAccountModalVisible(false);

    const projects = allProjects.filter((project) =>
      project.users.some((user) => user.id === foundAccount.id)
    );

    setActiveProjectId(projects[0]?.id || '');
    message.success('Вход выполнен');
  };

  const handleRegister = () => {
    if (!registerName.trim() || !registerPassword.trim()) {
      message.error('Введите имя и пароль');
      return;
    }

    if (accounts.some((account) => account.name === registerName.trim())) {
      message.error('Пользователь с таким именем уже существует');
      return;
    }

    const newAccount: Account = {
      id: 'user-' + Date.now(),
      name: registerName.trim(),
      password: registerPassword.trim(),
    };

    setAccounts([...accounts, newAccount]);
    setCurrentUser(newAccount);
    setActiveProjectId('');
    setRegisterName('');
    setRegisterPassword('');
    setIsAccountModalVisible(false);
    setIsRegisterMode(false);

    message.success('Аккаунт создан');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveProjectId('');
    setSelectedMenuKey('1');
    setIsAccountModalVisible(true);
    message.info('Вы вышли из аккаунта');
  };

  const handleSwitchAccount = () => {
    setCurrentUser(null);
    setActiveProjectId('');
    setSelectedMenuKey('1');
    setLoginName('');
    setLoginPassword('');
    setIsAccountModalVisible(true);
  };

  const handleEditName = () => {
    if (!currentUser) return;

    setEditName(currentUser.name);
    setIsEditNameModalVisible(true);
  };

  const handleSaveNewName = () => {
    if (!editName.trim() || !currentUser) {
      message.error('Введите имя');
      return;
    }

    const updatedName = editName.trim();

    setCurrentUser({
      ...currentUser,
      name: updatedName,
    });

    setAccounts((prevAccounts) =>
      prevAccounts.map((account) =>
        account.id === currentUser.id ? { ...account, name: updatedName } : account
      )
    );

    setAllProjects((prevProjects) =>
      prevProjects.map((project) => ({
        ...project,
        users: project.users.map((user) =>
          user.id === currentUser.id ? { ...user, name: updatedName } : user
        ),
      }))
    );

    setSources((prevSources) =>
      prevSources.map((source) =>
        source.authorId === currentUser.id
          ? { ...source, authorName: updatedName }
          : source.hiddenById === currentUser.id
            ? { ...source, hiddenByName: updatedName }
            : source
      )
    );

    setLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.authorId === currentUser.id
          ? { ...link, authorName: updatedName }
          : link.hiddenById === currentUser.id
            ? { ...link, hiddenByName: updatedName }
            : link
      )
    );

    setIsEditNameModalVisible(false);
    message.success('Имя изменено');
  };

  const handleCreateProjectClick = () => {
    setIsProjectActionModalVisible(true);
  };

  const handleCreateNewProject = () => {
    if (!currentUser) return;

    if (!newProjectName.trim()) {
      message.error('Введите название проекта');
      return;
    }

    const trimmedName = newProjectName.trim();
    const projectId = 'project-' + Date.now();

    const newProject: Project = {
      id: projectId,
      name: trimmedName,
      inviteLink: 'http://localhost:3000/join/project/' + projectId + '-token',
      users: [
        {
          id: currentUser.id,
          name: currentUser.name,
          role: 'admin',
        },
      ],
    };

    setAllProjects([...allProjects, newProject]);
    setActiveProjectId(newProject.id);
    setNewProjectName('');
    setIsCreateModalVisible(false);
    setIsProjectActionModalVisible(false);

    message.success('Проект "' + trimmedName + '" создан');
  };

  const handleJoinProject = () => {
    if (!currentUser) return;

    if (!joinProjectLink.trim()) {
      message.error('Введите ссылку приглашения');
      return;
    }

    const link = joinProjectLink.trim();

    const projectToJoin = allProjects.find((project) => project.inviteLink === link);

    if (!projectToJoin) {
      message.error('Проект по данной ссылке не найден');
      return;
    }

    if (projectToJoin.users.some((user) => user.id === currentUser.id)) {
      message.error('Вы уже состоите в этом проекте');
      return;
    }

    setAllProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id !== projectToJoin.id) return project;

        return {
          ...project,
          users: [
            ...project.users,
            {
              id: currentUser.id,
              name: currentUser.name,
              role: 'user',
            },
          ],
        };
      })
    );

    setActiveProjectId(projectToJoin.id);
    setJoinProjectLink('');
    setIsJoinModalVisible(false);
    setIsProjectActionModalVisible(false);

    message.success('Вы присоединились к проекту "' + projectToJoin.name + '"');
  };

  const handleCreateTextSource = () => {
    if (!currentUser || !activeProject) return;

    if (!sourceName.trim()) {
      message.error('Введите название документа');
      return;
    }

    if (!sourceText.trim()) {
      message.error('Введите текст документа');
      return;
    }

    const newSource: SourceItem = {
      id: 'source-' + Date.now(),
      projectId: activeProject.id,
      name: sourceName.trim(),
      type: 'text',
      content: sourceText.trim(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      createdAt: getCurrentDate(),
      isHidden: false,
    };

    setSources([...sources, newSource]);
    setSourceName('');
    setSourceText('');
    setIsTextSourceModalVisible(false);

    message.success('Текстовый документ создан');
  };

  const handleCreateFileSource = () => {
    if (!currentUser || !activeProject) return;

    if (!selectedSourceFile) {
      message.error('Выберите файл с компьютера или перетащите его в область загрузки');
      return;
    }

    const newSource: SourceItem = {
      id: 'source-' + Date.now(),
      projectId: activeProject.id,
      name: sourceName.trim() || selectedSourceFile.name,
      type: 'file',
      file: selectedSourceFile,
      filePreviewUrl: URL.createObjectURL(selectedSourceFile),
      fileName: selectedSourceFile.name,
      fileSize: selectedSourceFile.size,
      fileType: selectedSourceFile.type || 'Неизвестный тип',
      authorId: currentUser.id,
      authorName: currentUser.name,
      createdAt: getCurrentDate(),
      isHidden: false,
    };

    setSources([...sources, newSource]);
    setSourceName('');
    setSelectedSourceFile(null);
    setIsFileSourceModalVisible(false);

    message.success('Файл добавлен');
  };

  const handleDownloadSourceFile = (source: SourceItem) => {
    if (source.type !== 'file') return;

    if (!source.file) {
      message.warning('Этот файл был добавлен как пример и недоступен для скачивания');
      return;
    }

    const url = URL.createObjectURL(source.file);
    const link = document.createElement('a');

    link.href = url;
    link.download = source.fileName || source.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handlePreviewSourceFile = (source: SourceItem) => {
    if (source.type !== 'file') return;

    if (!source.filePreviewUrl) {
      message.warning('Этот файл был добавлен как пример и недоступен для просмотра');
      return;
    }

    setPreviewSource(source);
    setIsPreviewModalVisible(true);
  };
    const handleHideSource = (sourceId: string) => {
    if (!currentUser) return;

    const selectedSource = sources.find((source) => source.id === sourceId);

    if (!selectedSource) return;

    Modal.confirm({
      title: 'Скрыть источник?',
      content:
        'Источник "' +
        selectedSource.name +
        '" будет скрыт для обычных пользователей. Администратор сможет его вернуть.',
      okText: 'Скрыть',
      cancelText: 'Отмена',

      onOk: () => {
        setSources((prevSources) =>
          prevSources.map((source) =>
            source.id === sourceId
              ? {
                  ...source,
                  isHidden: true,
                  hiddenById: currentUser.id,
                  hiddenByName: currentUser.name,
                }
              : source
          )
        );

        message.success('Источник скрыт');
      },
    });
  };

  const handleRestoreSource = (sourceId: string) => {
    const selectedSource = sources.find((source) => source.id === sourceId);

    if (!selectedSource) return;

    Modal.confirm({
      title: 'Вернуть источник?',
      content: 'Источник "' + selectedSource.name + '" снова станет доступен пользователям.',
      okText: 'Вернуть',
      cancelText: 'Отмена',

      onOk: () => {
        setSources((prevSources) =>
          prevSources.map((source) =>
            source.id === sourceId
              ? {
                  ...source,
                  isHidden: false,
                  hiddenById: undefined,
                  hiddenByName: undefined,
                }
              : source
          )
        );

        message.success('Источник восстановлен');
      },
    });
  };

  const handleDeleteSource = (sourceId: string) => {
    if (!isAdmin) {
      message.error('Удалять источники может только администратор');
      return;
    }

    const selectedSource = sources.find((source) => source.id === sourceId);

    if (!selectedSource) return;

    Modal.confirm({
      title: 'Удалить источник?',
      content: 'Источник "' + selectedSource.name + '" будет удалён окончательно.',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okType: 'danger',

      onOk: () => {
        setSources((prevSources) =>
          prevSources.filter((source) => source.id !== sourceId)
        );

        message.success('Источник удалён');
      },
    });
  };

  const handleCreateLink = () => {
    if (!currentUser || !activeProject) return;

    if (!linkName.trim()) {
      message.error('Введите название ссылки');
      return;
    }

    if (!linkUrl.trim()) {
      message.error('Введите ссылку');
      return;
    }

    const newLink: LinkItem = {
      id: 'link-' + Date.now(),
      projectId: activeProject.id,
      name: linkName.trim(),
      url: normalizeUrl(linkUrl),
      authorId: currentUser.id,
      authorName: currentUser.name,
      createdAt: getCurrentDate(),
      isHidden: false,
    };

    setLinks([...links, newLink]);
    setLinkName('');
    setLinkUrl('');
    setIsLinkModalVisible(false);

    message.success('Ссылка добавлена');
  };

  const handleHideLink = (linkId: string) => {
    if (!currentUser) return;

    const selectedLink = links.find((link) => link.id === linkId);

    if (!selectedLink) return;

    Modal.confirm({
      title: 'Скрыть ссылку?',
      content:
        'Ссылка "' +
        selectedLink.name +
        '" будет скрыта для обычных пользователей. Администратор сможет её вернуть.',
      okText: 'Скрыть',
      cancelText: 'Отмена',

      onOk: () => {
        setLinks((prevLinks) =>
          prevLinks.map((link) =>
            link.id === linkId
              ? {
                  ...link,
                  isHidden: true,
                  hiddenById: currentUser.id,
                  hiddenByName: currentUser.name,
                }
              : link
          )
        );

        message.success('Ссылка скрыта');
      },
    });
  };

  const handleRestoreLink = (linkId: string) => {
    const selectedLink = links.find((link) => link.id === linkId);

    if (!selectedLink) return;

    Modal.confirm({
      title: 'Вернуть ссылку?',
      content: 'Ссылка "' + selectedLink.name + '" снова станет доступна пользователям.',
      okText: 'Вернуть',
      cancelText: 'Отмена',

      onOk: () => {
        setLinks((prevLinks) =>
          prevLinks.map((link) =>
            link.id === linkId
              ? {
                  ...link,
                  isHidden: false,
                  hiddenById: undefined,
                  hiddenByName: undefined,
                }
              : link
          )
        );

        message.success('Ссылка восстановлена');
      },
    });
  };

  const handleDeleteLink = (linkId: string) => {
    if (!isAdmin) {
      message.error('Удалять ссылки может только администратор');
      return;
    }

    const selectedLink = links.find((link) => link.id === linkId);

    if (!selectedLink) return;

    Modal.confirm({
      title: 'Удалить ссылку?',
      content: 'Ссылка "' + selectedLink.name + '" будет удалена окончательно.',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okType: 'danger',

      onOk: () => {
        setLinks((prevLinks) => prevLinks.filter((link) => link.id !== linkId));
        message.success('Ссылка удалена');
      },
    });
  };

  const handleCopyInviteLink = () => {
    if (!activeProject) return;

    navigator.clipboard.writeText(activeProject.inviteLink);
    message.success('Ссылка на проект скопирована');
  };

  const handleDeleteProjectCompletely = () => {
    if (!activeProject) return;

    if (currentUserProjectRole !== 'admin') {
      message.error('Удалить проект может только администратор');
      return;
    }

    Modal.confirm({
      title: 'Удалить проект полностью?',
      content:
        'Проект "' +
        activeProject.name +
        '" будет полностью удалён для всех участников. Это действие нельзя отменить.',
      okText: 'Удалить проект',
      cancelText: 'Отмена',
      okType: 'danger',

      onOk: () => {
        setAllProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== activeProject.id)
        );

        setSources((prevSources) =>
          prevSources.filter((source) => source.projectId !== activeProject.id)
        );

        setLinks((prevLinks) =>
          prevLinks.filter((link) => link.projectId !== activeProject.id)
        );

        setSelectedMenuKey('1');
        message.success('Проект "' + activeProject.name + '" удалён');
      },
    });
  };

  const handleLeaveProject = (projectId: string) => {
    if (!currentUser) return;

    const projectToLeave = allProjects.find((project) => project.id === projectId);

    if (!projectToLeave) return;

    const currentMember = projectToLeave.users.find((user) => user.id === currentUser.id);

    if (currentMember?.role === 'admin') {
      message.error('Администратор не может выйти из проекта, не передав права администратора');
      return;
    }

    Modal.confirm({
      title: 'Выйти из проекта?',
      content:
        'Вы будете удалены из проекта "' +
        projectToLeave.name +
        '". Чтобы вернуться, потребуется снова присоединиться к проекту.',
      okText: 'Выйти',
      cancelText: 'Отмена',
      okType: 'danger',

      onOk: () => {
        setAllProjects((prevProjects) =>
          prevProjects.map((project) => {
            if (project.id !== projectId) return project;

            return {
              ...project,
              users: project.users.filter((user) => user.id !== currentUser.id),
            };
          })
        );

        setSelectedMenuKey('1');
        message.success('Вы вышли из проекта "' + projectToLeave.name + '"');
      },
    });
  };

  const handleTransferAdminRights = (userId: string) => {
    if (!activeProject || !currentUser || currentUserProjectRole !== 'admin') return;

    const selectedUser = activeProject.users.find((user) => user.id === userId);

    if (!selectedUser) return;

    Modal.confirm({
      title: 'Передать права администратора?',
      content:
        'Вы действительно хотите передать права администратора пользователю "' +
        selectedUser.name +
        '"? После этого вы станете обычным пользователем проекта.',
      okText: 'Передать права',
      cancelText: 'Отмена',
      okType: 'danger',

      onOk: () => {
        setAllProjects((prevProjects) =>
          prevProjects.map((project) => {
            if (project.id !== activeProject.id) return project;

            return {
              ...project,
              users: project.users.map((user): ProjectUser => {
                if (user.id === userId) {
                  return { ...user, role: 'admin' };
                }

                if (user.id === currentUser.id) {
                  return { ...user, role: 'user' };
                }

                return { ...user, role: 'user' };
              }),
            };
          })
        );

        message.success('Права администратора переданы пользователю "' + selectedUser.name + '"');
      },
    });
  };

  const handleDeleteUserFromProject = (userId: string) => {
    if (!activeProject || !currentUser || currentUserProjectRole !== 'admin') return;

    const selectedUser = activeProject.users.find((user) => user.id === userId);

    if (!selectedUser) return;

    if (selectedUser.id === currentUser.id) {
      message.error('Нельзя удалить самого себя из проекта. Используйте выход из проекта');
      return;
    }

    if (selectedUser.role === 'admin') {
      message.error('Нельзя удалить администратора проекта');
      return;
    }

    Modal.confirm({
      title: 'Удалить пользователя из проекта?',
      content:
        'Пользователь "' + selectedUser.name + '" будет удалён из текущего проекта.',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okType: 'danger',

      onOk: () => {
        setAllProjects((prevProjects) =>
          prevProjects.map((project) => {
            if (project.id !== activeProject.id) return project;

            return {
              ...project,
              users: project.users.filter((user) => user.id !== userId),
            };
          })
        );

        message.success('Пользователь "' + selectedUser.name + '" удалён из проекта');
      },
    });
  };

  const tabItems: TabsProps['items'] = userProjects.map((project) => ({
    key: project.id,
    label: project.name,
    closable: userProjects.length > 1,
  }));

  const menuItems = [
    { key: '1', icon: <FileTextOutlined />, label: 'Тест кейсы' },
    { key: '2', icon: <BugOutlined />, label: 'Баг репорты' },
    { key: '3', icon: <CheckSquareOutlined />, label: 'Чек листы' },
    { key: '4', icon: <AuditOutlined />, label: 'Проверки' },
    { key: '5', icon: <LinkOutlined />, label: 'Ссылки' },
    { key: '6', icon: <FolderOpenOutlined />, label: 'Источники' },
    { key: 'project', icon: <TeamOutlined />, label: 'Проект' },
  ];

  const renderSourcesPage = () => {
    if (!activeProject) {
      return (
        <>
          <Title level={1} style={{ margin: 0, fontSize: 36, fontWeight: 700, color: '#002E5F' }}>
            Источники
          </Title>

          <p style={{ fontSize: 18, color: '#555', marginTop: 20 }}>
            Сначала выберите или создайте проект.
          </p>
        </>
      );
    }

    return (
      <>
        <Title level={1} style={{ margin: 0, fontSize: 36, fontWeight: 700, color: '#002E5F' }}>
          Источники проекта <span style={{ color: '#0078d4' }}>{activeProject.name}</span>
        </Title>

        <Space style={{ marginTop: 28, marginBottom: 30 }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setIsTextSourceModalVisible(true)}
            style={{
              background: '#0078d4',
              borderColor: '#0078d4',
              height: 42,
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            Создать текстовый документ
          </Button>

          <Button
            icon={<UploadOutlined />}
            onClick={() => setIsFileSourceModalVisible(true)}
            style={{
              height: 42,
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            Добавить файл
          </Button>
        </Space>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 1000 }}>
          {activeProjectSources.length === 0 ? (
            <Card style={{ borderRadius: 14 }}>
              <Text style={{ color: '#6b7280' }}>Источники пока не добавлены.</Text>
            </Card>
          ) : (
            activeProjectSources.map((source) => (
              <Card
                key={source.id}
                style={{
                  borderRadius: 14,
                  border: source.isHidden ? '1px solid #f59e0b' : '1px solid #e5e7eb',
                  background: source.isHidden ? '#fffbeb' : '#ffffff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 20,
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <Space style={{ marginBottom: 8 }}>
                      <Tag color={source.type === 'text' ? 'blue' : 'green'}>
                        {source.type === 'text' ? 'Текстовый документ' : 'Файл'}
                      </Tag>

                      {source.isHidden && (
                        <Tag color="orange">Скрыто пользователем: {source.hiddenByName}</Tag>
                      )}
                    </Space>

                    <Title level={4} style={{ margin: 0, color: '#1f2937' }}>
                      {source.name}
                    </Title>

                    <Text style={{ display: 'block', color: '#6b7280', marginTop: 6 }}>
                      Автор: {source.authorName} · Дата: {source.createdAt}
                    </Text>

                    {source.type === 'file' && (
                      <>
                        <Text style={{ display: 'block', marginTop: 10 }}>
                          Имя файла: <strong>{source.fileName}</strong>
                        </Text>

                        <Text style={{ display: 'block', marginTop: 4, color: '#6b7280' }}>
                          Размер: {formatFileSize(source.fileSize)}
                        </Text>

                        <Text style={{ display: 'block', marginTop: 4, color: '#6b7280' }}>
                          Тип: {source.fileType || 'Неизвестный тип'}
                        </Text>
                      </>
                    )}

                    {source.type === 'text' && (
                      <p
                        style={{
                          marginTop: 10,
                          marginBottom: 0,
                          color: '#374151',
                          maxWidth: 720,
                        }}
                      >
                        {source.content}
                      </p>
                    )}
                  </div>

                  <Space>
                    {source.type === 'file' && (
                      <>
                        <Button
                          icon={<EyeOutlined />}
                          onClick={() => handlePreviewSourceFile(source)}
                          style={{ borderRadius: 10, fontWeight: 600 }}
                        >
                          Просмотр
                        </Button>

                        <Button
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownloadSourceFile(source)}
                          style={{ borderRadius: 10, fontWeight: 600 }}
                        >
                          Скачать
                        </Button>
                      </>
                    )}

                    {source.isHidden && isAdmin ? (
                      <Button
                        icon={<RollbackOutlined />}
                        onClick={() => handleRestoreSource(source.id)}
                        style={{ borderRadius: 10, fontWeight: 600 }}
                      >
                        Вернуть
                      </Button>
                    ) : (
                      <Button
                        icon={<EyeInvisibleOutlined />}
                        onClick={() => handleHideSource(source.id)}
                        style={{ borderRadius: 10, fontWeight: 600 }}
                      >
                        Скрыть
                      </Button>
                    )}

                    {isAdmin && (
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteSource(source.id)}
                        style={{ borderRadius: 10, fontWeight: 600 }}
                      >
                        Удалить
                      </Button>
                    )}
                  </Space>
                </div>
              </Card>
            ))
          )}
        </div>
      </>
    );
  };

  const renderLinksPage = () => {
    if (!activeProject) {
      return (
        <>
          <Title level={1} style={{ margin: 0, fontSize: 36, fontWeight: 700, color: '#002E5F' }}>
            Ссылки
          </Title>

          <p style={{ fontSize: 18, color: '#555', marginTop: 20 }}>
            Сначала выберите или создайте проект.
          </p>
        </>
      );
    }

    return (
      <>
        <Title level={1} style={{ margin: 0, fontSize: 36, fontWeight: 700, color: '#002E5F' }}>
          Ссылки проекта <span style={{ color: '#0078d4' }}>{activeProject.name}</span>
        </Title>

        <Space style={{ marginTop: 28, marginBottom: 30 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsLinkModalVisible(true)}
            style={{
              background: '#0078d4',
              borderColor: '#0078d4',
              height: 42,
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            Добавить ссылку
          </Button>
        </Space>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 1000 }}>
          {activeProjectLinks.length === 0 ? (
            <Card style={{ borderRadius: 14 }}>
              <Text style={{ color: '#6b7280' }}>Ссылки пока не добавлены.</Text>
            </Card>
          ) : (
            activeProjectLinks.map((link) => (
              <Card
                key={link.id}
                style={{
                  borderRadius: 14,
                  border: link.isHidden ? '1px solid #f59e0b' : '1px solid #e5e7eb',
                  background: link.isHidden ? '#fffbeb' : '#ffffff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 20,
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <Space style={{ marginBottom: 8 }}>
                      <Tag color="purple">Ссылка</Tag>

                      {link.isHidden && (
                        <Tag color="orange">Скрыто пользователем: {link.hiddenByName}</Tag>
                      )}
                    </Space>

                    <Title level={4} style={{ margin: 0 }}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#0078d4' }}
                      >
                        {link.name}
                      </a>
                    </Title>

                    <Text style={{ display: 'block', color: '#6b7280', marginTop: 6 }}>
                      Автор: {link.authorName} · Дата: {link.createdAt}
                    </Text>

                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'block',
                        marginTop: 10,
                        color: '#2563eb',
                        wordBreak: 'break-all',
                      }}
                    >
                      {link.url}
                    </a>
                  </div>

                  <Space>
                    {link.isHidden && isAdmin ? (
                      <Button
                        icon={<RollbackOutlined />}
                        onClick={() => handleRestoreLink(link.id)}
                        style={{ borderRadius: 10, fontWeight: 600 }}
                      >
                        Вернуть
                      </Button>
                    ) : (
                      <Button
                        icon={<EyeInvisibleOutlined />}
                        onClick={() => handleHideLink(link.id)}
                        style={{ borderRadius: 10, fontWeight: 600 }}
                      >
                        Скрыть
                      </Button>
                    )}

                    {isAdmin && (
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteLink(link.id)}
                        style={{ borderRadius: 10, fontWeight: 600 }}
                      >
                        Удалить
                      </Button>
                    )}
                  </Space>
                </div>
              </Card>
            ))
          )}
        </div>
      </>
    );
  };
    const renderProjectPage = () => {
    if (!activeProject) {
      return (
        <>
          <Title level={1} style={{ margin: 0, fontSize: 36, fontWeight: 700, color: '#002E5F' }}>
            Нет активного проекта
          </Title>

          <p style={{ fontSize: 18, color: '#555', marginTop: 20, maxWidth: 680 }}>
            Создайте новый проект или присоединитесь к существующему.
          </p>
        </>
      );
    }

    return (
      <>
        <Title level={1} style={{ margin: 0, fontSize: 36, fontWeight: 700, color: '#002E5F' }}>
          Управление проектом <span style={{ color: '#0078d4' }}>{activeProject.name}</span>
        </Title>

        <div
          style={{
            marginTop: 24,
            maxWidth: 900,
            background: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: 14,
            padding: 18,
          }}
        >
          <Text style={{ display: 'block', marginBottom: 10, color: '#555' }}>
            Ссылка на текущий проект:
          </Text>

          <Space.Compact style={{ width: '100%' }}>
            <Input value={activeProject.inviteLink} readOnly />
            <Button icon={<CopyOutlined />} onClick={handleCopyInviteLink}>
              Копировать
            </Button>
          </Space.Compact>
        </div>

        <Space style={{ marginTop: 28, marginBottom: 30 }}>
          {currentUserProjectRole === 'admin' ? (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDeleteProjectCompletely}
              style={{ height: 42, borderRadius: 10, fontWeight: 600 }}
            >
              Удалить проект полностью
            </Button>
          ) : (
            <Button
              danger
              icon={<LogoutOutlined />}
              onClick={() => handleLeaveProject(activeProject.id)}
              style={{ height: 42, borderRadius: 10, fontWeight: 600 }}
            >
              Выйти из проекта
            </Button>
          )}
        </Space>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 900 }}>
          {activeProject.users.map((user) => (
            <div
              key={user.id}
              style={{
                background: '#f8fafc',
                border: '1px solid #e5e7eb',
                borderRadius: 14,
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 20,
              }}
            >
              <Space size={14}>
                <Avatar
                  icon={<UserOutlined />}
                  size={42}
                  style={{ backgroundColor: user.role === 'admin' ? '#003087' : '#0078d4' }}
                />

                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#1f2937' }}>
                    {user.name}
                  </div>

                  <Text style={{ fontSize: 13, color: user.role === 'admin' ? '#003087' : '#6b7280' }}>
                    {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                  </Text>
                </div>
              </Space>

              {user.role === 'admin' ? (
                <Space>
                  <CrownOutlined style={{ color: '#003087' }} />
                  <Text style={{ color: '#003087', fontWeight: 600 }}>Администратор</Text>
                </Space>
              ) : currentUserProjectRole === 'admin' ? (
                <Space>
                  <Button
                    type="primary"
                    onClick={() => handleTransferAdminRights(user.id)}
                    style={{
                      background: '#0078d4',
                      borderColor: '#0078d4',
                      borderRadius: 10,
                      fontWeight: 600,
                    }}
                  >
                    Передать права
                  </Button>

                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteUserFromProject(user.id)}
                    style={{ borderRadius: 10, fontWeight: 600 }}
                  >
                    Удалить
                  </Button>
                </Space>
              ) : (
                <Text style={{ color: '#6b7280' }}>Участник проекта</Text>
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderContent = () => {
    if (selectedMenuKey === 'project') {
      return renderProjectPage();
    }

    if (selectedMenuKey === '5') {
      return renderLinksPage();
    }

    if (selectedMenuKey === '6') {
      return renderSourcesPage();
    }

    if (!activeProject) {
      return (
        <>
          <Title level={1} style={{ margin: 0, fontSize: 36, fontWeight: 700, color: '#002E5F' }}>
            Добро пожаловать
          </Title>

          <p style={{ fontSize: 18, color: '#555', marginTop: 20, maxWidth: 680 }}>
            Создайте новый проект или присоединитесь к существующему.
          </p>
        </>
      );
    }

    return (
      <>
        <Title level={1} style={{ margin: 0, fontSize: 36, fontWeight: 700, color: '#002E5F' }}>
          Добро пожаловать в <span style={{ color: '#0078d4' }}>{activeProject.name}</span>
        </Title>

        <p style={{ fontSize: 18, color: '#555', marginTop: 20, maxWidth: 680 }}>
          Выберите нужный раздел в меню слева, чтобы начать работу с проектом.
        </p>
      </>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <style>
        {`
          .ant-tabs-tab-remove {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            opacity: 1 !important;
            visibility: visible !important;
            width: 18px !important;
            height: 18px !important;
            margin-left: 8px !important;
            color: inherit !important;
          }

          .ant-tabs-tab-remove:hover {
            color: #ff4d4f !important;
          }

          .project-tabs-scroll::-webkit-scrollbar {
            height: 8px;
          }

          .project-tabs-scroll::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 10px;
          }

          .project-tabs-scroll::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.65);
            border-radius: 10px;
          }

          .project-tabs-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.9);
          }

          .project-tabs-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.65) rgba(255, 255, 255, 0.15);
          }
        `}
      </style>

      <Header
        style={{
          background: '#003087',
          padding: '0 24px',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          color: '#fff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          flexWrap: 'nowrap',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, width: 260, marginRight: -6 }}>
          <img src={logo} alt="Норникель" style={{ height: 56, width: 'auto', objectFit: 'contain', display: 'block' }} />
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateProjectClick}
          disabled={!currentUser}
          style={{
            background: '#0078d4',
            borderColor: '#0078d4',
            height: 48,
            paddingInline: 24,
            fontWeight: 600,
            borderRadius: 12,
            flexShrink: 0,
            marginLeft: -14,
          }}
        >
          Создать проект
        </Button>

        <div
          className="project-tabs-scroll"
          style={{
            flex: 1,
            minWidth: 0,
            maxWidth: '100%',
            overflowX: 'auto',
            overflowY: 'hidden',
            padding: '8px 0 6px',
          }}
        >
          <div style={{ minWidth: 'max-content' }}>
            <Tabs
              type="editable-card"
              hideAdd
              activeKey={activeProjectId}
              onChange={setActiveProjectId}
              onEdit={(key, action) => {
                if (action === 'remove') {
                  handleLeaveProject(key as string);
                }
              }}
              items={tabItems}
              removeIcon={<CloseOutlined />}
              style={{ marginBottom: 0, whiteSpace: 'nowrap' }}
              tabBarStyle={{ marginBottom: 0, color: '#fff' }}
              tabBarGutter={8}
              size="large"
            />
          </div>
        </div>

        <AutoComplete
          value={searchValue}
          onChange={setSearchValue}
          options={userProjects
            .filter((project) =>
              project.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((project) => ({
              value: project.name,
              label: project.name,
            }))}
          style={{ height: 48, width: 300, flexShrink: 0 }}
          onSelect={(value) => {
            const foundProject = userProjects.find((project) => project.name === value);

            if (foundProject) {
              setActiveProjectId(foundProject.id);
            }

            setSearchValue('');
          }}
        >
          <Input
            placeholder="Поиск по проектам..."
            style={{ height: 48, borderRadius: 12, padding: '0 16px' }}
          />
        </AutoComplete>

        <Dropdown
          trigger={['click']}
          menu={{
            items: [
              { key: 'edit', label: 'Изменить имя', onClick: handleEditName },
              { key: 'switch', label: 'Войти в другой аккаунт', onClick: handleSwitchAccount },
              { key: 'logout', label: 'Выйти', onClick: handleLogout },
            ],
          }}
        >
          <Space style={{ cursor: 'pointer', padding: '4px 12px', borderRadius: 8, flexShrink: 0 }}>
            <Avatar icon={<UserOutlined />} size={44} style={{ backgroundColor: '#0078d4' }} />

            <div style={{ color: '#fff', lineHeight: 1.25, minWidth: 100 }}>
              <div style={{ fontWeight: 500 }}>
                {currentUser ? currentUser.name : 'Гость'}
              </div>

              <Text style={{ fontSize: 12.5, color: '#b0d0ff' }}>
                {activeProject
                  ? currentUserProjectRole === 'admin'
                    ? 'Администратор'
                    : 'Пользователь'
                  : 'Нет проекта'}
              </Text>
            </div>

            <DownOutlined />
          </Space>
        </Dropdown>
      </Header>

      <Layout>
        <Sider
          width={280}
          style={{
            background: 'linear-gradient(to bottom, #003087, #006d7a)',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedMenuKey]}
            items={menuItems}
            onClick={({ key }) => setSelectedMenuKey(key)}
            style={{ background: 'transparent', borderRight: 0, marginTop: 12, padding: '0 8px' }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: 32,
              left: 24,
              right: 24,
              fontSize: 13.5,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            Единая служба поддержки сервисов
            <br />
            <strong>8 (800) 700-59-11</strong>
            <br />
            5911@nornik.ru
          </div>
        </Sider>

        <Content style={{ padding: 0, background: '#f5f7fa' }}>
          <div
            style={{
              background: '#ffffff',
              minHeight: 'calc(100vh - 72px)',
              padding: '56px 68px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
            }}
          >
            {renderContent()}
          </div>
        </Content>
      </Layout>

      <Modal
        title={isRegisterMode ? 'Создание аккаунта' : 'Вход в аккаунт'}
        open={isAccountModalVisible}
        closable={false}
        maskClosable={false}
        keyboard={false}
        onOk={isRegisterMode ? handleRegister : handleLogin}
        okText={isRegisterMode ? 'Создать аккаунт' : 'Войти'}
        cancelButtonProps={{ style: { display: 'none' } }}
        centered
      >
        {isRegisterMode ? (
          <>
            <Input
              placeholder="Имя пользователя"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              style={{ marginBottom: 12 }}
              autoFocus
            />

            <Input.Password
              placeholder="Пароль"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              onPressEnter={handleRegister}
            />

            <Button type="link" onClick={() => setIsRegisterMode(false)} style={{ paddingLeft: 0, marginTop: 12 }}>
              Уже есть аккаунт? Войти
            </Button>
          </>
        ) : (
          <>
            <Text style={{ display: 'block', marginBottom: 12 }}>
              Тестовые пользователи: Иванов И. И., Петров П. П., Сидоров С. С., Смирнов А. А. Пароль у всех: 1234
            </Text>

            <Input
              placeholder="Имя пользователя"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              style={{ marginBottom: 12 }}
              autoFocus
            />

            <Input.Password
              placeholder="Пароль"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              onPressEnter={handleLogin}
            />

            <Button type="link" onClick={() => setIsRegisterMode(true)} style={{ paddingLeft: 0, marginTop: 12 }}>
              Создать новый аккаунт
            </Button>
          </>
        )}
      </Modal>

      <Modal
        title="Изменение имени"
        open={isEditNameModalVisible}
        onCancel={() => setIsEditNameModalVisible(false)}
        onOk={handleSaveNewName}
        okText="Сохранить"
        cancelText="Отмена"
        centered
      >
        <Input
          placeholder="Введите новое имя"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onPressEnter={handleSaveNewName}
          autoFocus
        />
      </Modal>

      <Modal
        title="Действие с проектом"
        open={isProjectActionModalVisible}
        onCancel={() => setIsProjectActionModalVisible(false)}
        footer={null}
        centered
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px 0' }}>
          <Button
            type="primary"
            size="large"
            block
            onClick={() => {
              setIsProjectActionModalVisible(false);
              setIsCreateModalVisible(true);
            }}
          >
            Создать новый проект
          </Button>

          <Button
            size="large"
            block
            onClick={() => {
              setIsProjectActionModalVisible(false);
              setIsJoinModalVisible(true);
            }}
          >
            Присоединиться к проекту по ссылке
          </Button>
        </div>
      </Modal>

      <Modal
        title="Создание нового проекта"
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          setNewProjectName('');
        }}
        onOk={handleCreateNewProject}
        okText="Создать"
        cancelText="Отмена"
        centered
      >
        <Input
          placeholder="Введите название проекта"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          onPressEnter={handleCreateNewProject}
          style={{ marginTop: 8 }}
          autoFocus
        />
      </Modal>

      <Modal
        title="Присоединение к проекту"
        open={isJoinModalVisible}
        onCancel={() => {
          setIsJoinModalVisible(false);
          setJoinProjectLink('');
        }}
        onOk={handleJoinProject}
        okText="Присоединиться"
        cancelText="Отмена"
        centered
      >
        <Input
          placeholder="Вставьте ссылку приглашения"
          value={joinProjectLink}
          onChange={(e) => setJoinProjectLink(e.target.value)}
          onPressEnter={handleJoinProject}
          style={{ marginTop: 8 }}
          autoFocus
        />
      </Modal>

      <Modal
        title="Создание текстового документа"
        open={isTextSourceModalVisible}
        onCancel={() => {
          setIsTextSourceModalVisible(false);
          setSourceName('');
          setSourceText('');
        }}
        onOk={handleCreateTextSource}
        okText="Создать"
        cancelText="Отмена"
        centered
      >
        <Input
          placeholder="Название документа"
          value={sourceName}
          onChange={(e) => setSourceName(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        <TextArea
          placeholder="Текст документа"
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          rows={6}
        />
      </Modal>

      <Modal
        title="Добавление файла"
        open={isFileSourceModalVisible}
        onCancel={() => {
          setIsFileSourceModalVisible(false);
          setSourceName('');
          setSelectedSourceFile(null);
        }}
        onOk={handleCreateFileSource}
        okText="Добавить"
        cancelText="Отмена"
        centered
      >
        <Input
          placeholder="Название источника, если нужно"
          value={sourceName}
          onChange={(e) => setSourceName(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <Dragger
          multiple={false}
          maxCount={1}
          beforeUpload={(file) => {
            setSelectedSourceFile(file);

            if (!sourceName.trim()) {
              setSourceName(file.name);
            }

            return false;
          }}
          onRemove={() => {
            setSelectedSourceFile(null);
            return true;
          }}
          fileList={
            selectedSourceFile
              ? [
                  {
                    uid: 'selected-file',
                    name: selectedSourceFile.name,
                    status: 'done',
                  },
                ]
              : []
          }
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>

          <p className="ant-upload-text">
            Нажмите или перетащите файл в эту область
          </p>

          <p className="ant-upload-hint">
            Файл будет прикреплён к текущему проекту как источник.
          </p>
        </Dragger>
      </Modal>

      <Modal
        title="Добавление ссылки"
        open={isLinkModalVisible}
        onCancel={() => {
          setIsLinkModalVisible(false);
          setLinkName('');
          setLinkUrl('');
        }}
        onOk={handleCreateLink}
        okText="Добавить"
        cancelText="Отмена"
        centered
      >
        <Input
          placeholder="Название ссылки"
          value={linkName}
          onChange={(e) => setLinkName(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        <Input
          placeholder="Ссылка, например https://figma.com/..."
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          onPressEnter={handleCreateLink}
        />
      </Modal>

      <Modal
        title={previewSource?.name || 'Просмотр файла'}
        open={isPreviewModalVisible}
        onCancel={() => {
          setIsPreviewModalVisible(false);
          setPreviewSource(null);
        }}
        footer={null}
        width={900}
        centered
      >
        {previewSource?.filePreviewUrl && previewSource.fileType?.startsWith('image/') ? (
          <img
            src={previewSource.filePreviewUrl}
            alt={previewSource.name}
            style={{
              width: '100%',
              maxHeight: '70vh',
              objectFit: 'contain',
              borderRadius: 12,
            }}
          />
        ) : previewSource?.filePreviewUrl && previewSource.fileType === 'application/pdf' ? (
          <iframe
            src={previewSource.filePreviewUrl}
            title={previewSource.name}
            style={{
              width: '100%',
              height: '70vh',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
            }}
          />
        ) : previewSource?.filePreviewUrl && previewSource.fileType?.startsWith('text/') ? (
          <iframe
            src={previewSource.filePreviewUrl}
            title={previewSource.name}
            style={{
              width: '100%',
              height: '70vh',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Text style={{ display: 'block', fontSize: 16, marginBottom: 16 }}>
              Предпросмотр этого типа файла недоступен.
            </Text>

            <Button
              type="primary"
              onClick={() => previewSource && handleDownloadSourceFile(previewSource)}
            >
              Скачать файл
            </Button>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default App;
