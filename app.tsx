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
  Select,
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

type ChecklistStatus = 'not-checked' | 'passed' | 'failed' | 'blocked';

type ChecklistAttachment = {
  id: string;
  name: string;
  type: SourceType;
  content?: string;
  file?: File;
  filePreviewUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
};

type ChecklistEnvironment = {
  id: string;
  name: string;
};

type ChecklistResolution = {
  id: string;
  name: string;
  environments: ChecklistEnvironment[];
};

type ChecklistRow = {
  id: string;
  number: number;
  description: string;
  status: ChecklistStatus;
  resolutions: ChecklistResolution[];
  environmentValues: Record<string, string>;
  bugReportId?: string;
  bugReportName?: string;
  attachments: ChecklistAttachment[];
};

type ChecklistItem = {
  id: string;
  projectId: string;
  name: string;
  dataType: string;
  resolutions: ChecklistResolution[];
  rows: ChecklistRow[];
  authorId: string;
  authorName: string;
  createdAt: string;
  isHidden: boolean;
  hiddenById?: string;
  hiddenByName?: string;
};

type ChecklistColumnKey = 'number' | 'description' | 'status' | 'resolution' | 'bugReport' | 'photos';

type ChecklistColumnWidths = Record<ChecklistColumnKey, number>;

type BugReportStatus = 'new' | 'in-progress' | 'fixed' | 'closed' | 'rejected';

type BugReportPriority = 'low' | 'medium' | 'high' | 'critical';

type BugReportItem = {
  id: string;
  projectId: string;
  name: string;
  status: BugReportStatus;
  priority: BugReportPriority;
  prerequisite: string;
  stepsDescription: string;
  expectedResult: string;
  actualResult: string;
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

const initialChecklists: ChecklistItem[] = [
  {
    id: 'checklist-1',
    projectId: 'project-1',
    name: 'Проверка стартовой страницы',
    dataType: 'Чек-лист',
    resolutions: [
      {
        id: 'resolution-1',
        name: '',
        environments: [
          { id: 'environment-1', name: '' },
          { id: 'environment-2', name: '' },
        ],
      },
    ],
    rows: [
      {
        id: 'row-1',
        number: 1,
        description: '',
        status: 'not-checked',
        resolutions: [
          {
            id: 'row-1-resolution-1',
            name: '',
            environments: [
              { id: 'row-1-environment-1', name: '' },
              { id: 'row-1-environment-2', name: '' },
            ],
          },
        ],
        environmentValues: {},
        bugReportId: undefined,
        bugReportName: undefined,
        attachments: [],
      },
    ],
    authorId: 'user-1',
    authorName: 'Иванов И. И.',
    createdAt: '15.05.2026',
    isHidden: false,
  },
];

const initialBugReports: BugReportItem[] = [
  {
    id: 'bug-report-1',
    projectId: 'project-1',
    name: 'Ошибка отображения стартовой страницы',
    status: 'new',
    priority: 'medium',
    prerequisite: '',
    stepsDescription: '',
    expectedResult: '',
    actualResult: '',
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
  const [checklists, setChecklists] = useState<ChecklistItem[]>(initialChecklists);
  const [bugReports, setBugReports] = useState<BugReportItem[]>(initialBugReports);

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

  const [isChecklistModalVisible, setIsChecklistModalVisible] = useState(false);
  const [checklistName, setChecklistName] = useState('');
  const [checklistDataType, setChecklistDataType] = useState('Чек-лист');
  const [expandedChecklistIds, setExpandedChecklistIds] = useState<string[]>([]);
  const [selectedChecklistIdForPhoto, setSelectedChecklistIdForPhoto] = useState<string | null>(null);
  const [selectedChecklistRowIdForPhoto, setSelectedChecklistRowIdForPhoto] = useState<string | null>(null);
  const [isChecklistPhotoChoiceModalVisible, setIsChecklistPhotoChoiceModalVisible] = useState(false);
  const [isChecklistComputerPhotoModalVisible, setIsChecklistComputerPhotoModalVisible] = useState(false);
  const [isChecklistSourcePhotoModalVisible, setIsChecklistSourcePhotoModalVisible] = useState(false);
  const [selectedChecklistPhotoFile, setSelectedChecklistPhotoFile] = useState<File | null>(null);

  const [isBugReportModalVisible, setIsBugReportModalVisible] = useState(false);
  const [bugReportName, setBugReportName] = useState('');
  const [bugReportStatus, setBugReportStatus] = useState<BugReportStatus>('new');
  const [bugReportPriority, setBugReportPriority] = useState<BugReportPriority>('medium');
  const [bugReportPrerequisite, setBugReportPrerequisite] = useState('');
  const [bugReportStepsDescription, setBugReportStepsDescription] = useState('');
  const [bugReportExpectedResult, setBugReportExpectedResult] = useState('');
  const [bugReportActualResult, setBugReportActualResult] = useState('');
  const [expandedBugReportIds, setExpandedBugReportIds] = useState<string[]>([]);
  const [selectedChecklistIdForBugReport, setSelectedChecklistIdForBugReport] = useState<string | null>(null);
  const [selectedChecklistRowIdForBugReport, setSelectedChecklistRowIdForBugReport] = useState<string | null>(null);
  const [isChecklistBugReportModalVisible, setIsChecklistBugReportModalVisible] = useState(false);
  const [checklistColumnWidths, setChecklistColumnWidths] = useState<ChecklistColumnWidths>({
    number: 64,
    description: 560,
    status: 190,
    resolution: 560,
    bugReport: 210,
    photos: 260,
  });

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

  const activeProjectChecklists = activeProject
    ? checklists.filter((checklist) => {
        if (checklist.projectId !== activeProject.id) return false;
        if (isAdmin) return true;
        return !checklist.isHidden;
      })
    : [];

  const activeProjectBugReports = activeProject
    ? bugReports.filter((bugReport) => {
        if (bugReport.projectId !== activeProject.id) return false;
        if (isAdmin) return true;
        return !bugReport.isHidden;
      })
    : [];

  const activeProjectPhotoSources = activeProjectSources.filter(
    (source) => source.type === 'file' && source.fileType?.startsWith('image/')
  );

  useEffect(() => {
    if (userProjects.length > 0 && !userProjects.some((project) => project.id === activeProjectId)) {
      setActiveProjectId(userProjects[0].id);
    }

    if (userProjects.length === 0) {
      setActiveProjectId('');
    }
  }, [currentUser, allProjects, activeProjectId, userProjects]);

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('ru-RU');
  };

  const formatFileSize = (size?: number) => {
    if (!size) return 'Не указан';

    if (size < 1024) return size + ' Б';
    if (size < 1024 * 1024) return Math.round(size / 1024) + ' КБ';

    return (size / 1024 / 1024).toFixed(2) + ' МБ';
  };

  const getShortText = (text?: string) => {
    if (!text) return '';

    if (text.length <= 200) return text;

    return text.slice(0, 200) + '...';
  };

  const normalizeUrl = (url: string) => {
    const trimmedUrl = url.trim();

    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return trimmedUrl;
    }

    return 'https://' + trimmedUrl;
  };

  const checklistStatusOptions: { value: ChecklistStatus; label: string }[] = [
    { value: 'not-checked', label: 'Не проверено' },
    { value: 'passed', label: 'Пройдено' },
    { value: 'failed', label: 'Ошибка' },
    { value: 'blocked', label: 'Заблокировано' },
  ];

  const bugReportStatusOptions: { value: BugReportStatus; label: string }[] = [
    { value: 'new', label: 'Новый' },
    { value: 'in-progress', label: 'В работе' },
    { value: 'fixed', label: 'Исправлен' },
    { value: 'closed', label: 'Закрыт' },
    { value: 'rejected', label: 'Отклонён' },
  ];

  const bugReportPriorityOptions: { value: BugReportPriority; label: string }[] = [
    { value: 'low', label: 'Низкий' },
    { value: 'medium', label: 'Средний' },
    { value: 'high', label: 'Высокий' },
    { value: 'critical', label: 'Критический' },
  ];

  const getBugReportStatusLabel = (status: BugReportStatus) =>
    bugReportStatusOptions.find((option) => option.value === status)?.label || status;

  const getBugReportPriorityLabel = (priority: BugReportPriority) =>
    bugReportPriorityOptions.find((option) => option.value === priority)?.label || priority;

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

    if (registerName.trim().length > 20) {
      message.error('Имя пользователя не должно превышать 20 символов');
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

    if (editName.trim().length > 20) {
      message.error('Имя пользователя не должно превышать 20 символов');
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

    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.authorId === currentUser.id
          ? { ...checklist, authorName: updatedName }
          : checklist.hiddenById === currentUser.id
            ? { ...checklist, hiddenByName: updatedName }
            : checklist
      )
    );

    setBugReports((prevBugReports) =>
      prevBugReports.map((bugReport) =>
        bugReport.authorId === currentUser.id
          ? { ...bugReport, authorName: updatedName }
          : bugReport.hiddenById === currentUser.id
            ? { ...bugReport, hiddenByName: updatedName }
            : bugReport
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

  const handleDownloadTextSource = (source: SourceItem) => {
    if (source.type !== 'text') return;

    const fileText = source.content || '';
    const blob = new Blob([fileText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${source.name || 'text-document'}.txt`;
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

  const handlePreviewTextSource = (source: SourceItem) => {
    if (source.type !== 'text') return;

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

        setChecklists((prevChecklists) =>
          prevChecklists.filter((checklist) => checklist.projectId !== activeProject.id)
        );

        setBugReports((prevBugReports) =>
          prevBugReports.filter((bugReport) => bugReport.projectId !== activeProject.id)
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

  const resetChecklistCreateForm = () => {
    setChecklistName('');
    setChecklistDataType('Чек-лист');
  };

  const createEmptyChecklistRow = (number: number): ChecklistRow => ({
    id: 'row-' + Date.now() + '-' + Math.random().toString(16).slice(2),
    number,
    description: '',
    status: 'not-checked',
    resolutions: [createEmptyChecklistResolution()],
    environmentValues: {},
    bugReportId: undefined,
    bugReportName: undefined,
    attachments: [],
  });

  const createEmptyChecklistResolution = (): ChecklistResolution => ({
    id: 'resolution-' + Date.now() + '-' + Math.random().toString(16).slice(2),
    name: '',
    environments: [
      {
        id: 'environment-' + Date.now() + '-1-' + Math.random().toString(16).slice(2),
        name: '',
      },
      {
        id: 'environment-' + Date.now() + '-2-' + Math.random().toString(16).slice(2),
        name: '',
      },
    ],
  });

  const handleCreateChecklist = () => {
    if (!currentUser || !activeProject) return;

    if (!checklistName.trim()) {
      message.error('Введите название чек-листа');
      return;
    }

    const newChecklist: ChecklistItem = {
      id: 'checklist-' + Date.now(),
      projectId: activeProject.id,
      name: checklistName.trim(),
      dataType: checklistDataType.trim() || 'Чек-лист',
      resolutions: [createEmptyChecklistResolution()],
      rows: [createEmptyChecklistRow(1)],
      authorId: currentUser.id,
      authorName: currentUser.name,
      createdAt: getCurrentDate(),
      isHidden: false,
    };

    setChecklists([...checklists, newChecklist]);
    setExpandedChecklistIds([...expandedChecklistIds, newChecklist.id]);
    resetChecklistCreateForm();
    setIsChecklistModalVisible(false);
    message.success('Чек-лист создан');
  };

  const toggleChecklistExpanded = (checklistId: string) => {
    setExpandedChecklistIds((prevIds) =>
      prevIds.includes(checklistId)
        ? prevIds.filter((id) => id !== checklistId)
        : [...prevIds, checklistId]
    );
  };

  const handleUpdateChecklistRowDescription = (
    checklistId: string,
    rowId: string,
    value: string
  ) => {
    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              rows: checklist.rows.map((row) =>
                row.id === rowId ? { ...row, description: value } : row
              ),
            }
          : checklist
      )
    );
  };

  const handleUpdateChecklistRowStatus = (
    checklistId: string,
    rowId: string,
    status: ChecklistStatus
  ) => {
    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              rows: checklist.rows.map((row) =>
                row.id === rowId ? { ...row, status } : row
              ),
            }
          : checklist
      )
    );
  };

  const handleMoveChecklist = (checklistId: string, direction: 'up' | 'down') => {
    setChecklists((prevChecklists) => {
      const currentIndex = prevChecklists.findIndex((checklist) => checklist.id === checklistId);

      if (currentIndex === -1) return prevChecklists;

      const currentChecklist = prevChecklists[currentIndex];
      const step = direction === 'up' ? -1 : 1;
      let swapIndex = currentIndex + step;

      while (swapIndex >= 0 && swapIndex < prevChecklists.length) {
        if (prevChecklists[swapIndex].projectId === currentChecklist.projectId) {
          const updatedChecklists = [...prevChecklists];
          [updatedChecklists[currentIndex], updatedChecklists[swapIndex]] = [
            updatedChecklists[swapIndex],
            updatedChecklists[currentIndex],
          ];
          return updatedChecklists;
        }

        swapIndex += step;
      }

      return prevChecklists;
    });
  };

  const handleMoveChecklistRow = (checklistId: string, rowId: string, direction: 'up' | 'down') => {
    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) => {
        if (checklist.id !== checklistId) return checklist;

        const currentIndex = checklist.rows.findIndex((row) => row.id === rowId);
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (currentIndex === -1 || targetIndex < 0 || targetIndex >= checklist.rows.length) {
          return checklist;
        }

        const updatedRows = [...checklist.rows];
        [updatedRows[currentIndex], updatedRows[targetIndex]] = [
          updatedRows[targetIndex],
          updatedRows[currentIndex],
        ];

        return {
          ...checklist,
          rows: updatedRows.map((row, index) => ({ ...row, number: index + 1 })),
        };
      })
    );
  };

  const handleUpdateChecklistEnvironmentValue = (
    checklistId: string,
    rowId: string,
    environmentId: string,
    value: string
  ) => {
    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              rows: checklist.rows.map((row) =>
                row.id === rowId
                  ? {
                      ...row,
                      environmentValues: {
                        ...row.environmentValues,
                        [environmentId]: value,
                      },
                    }
                  : row
              ),
            }
          : checklist
      )
    );
  };

  const handleUpdateChecklistResolutionName = (
    checklistId: string,
    rowId: string,
    resolutionId: string,
    value: string
  ) => {
    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              rows: checklist.rows.map((row) =>
                row.id === rowId
                  ? {
                      ...row,
                      resolutions: row.resolutions.map((resolution) =>
                        resolution.id === resolutionId ? { ...resolution, name: value } : resolution
                      ),
                    }
                  : row
              ),
            }
          : checklist
      )
    );
  };

  const handleUpdateChecklistEnvironmentName = (
    checklistId: string,
    rowId: string,
    resolutionId: string,
    environmentId: string,
    value: string
  ) => {
    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              rows: checklist.rows.map((row) =>
                row.id === rowId
                  ? {
                      ...row,
                      resolutions: row.resolutions.map((resolution) =>
                        resolution.id === resolutionId
                          ? {
                              ...resolution,
                              environments: resolution.environments.map((environment) =>
                                environment.id === environmentId
                                  ? { ...environment, name: value }
                                  : environment
                              ),
                            }
                          : resolution
                      ),
                    }
                  : row
              ),
            }
          : checklist
      )
    );
  };

  const handleAddChecklistEnvironment = (
    checklistId: string,
    rowId: string,
    resolutionId: string
  ) => {
    const newEnvironment: ChecklistEnvironment = {
      id: 'environment-' + Date.now() + '-' + Math.random().toString(16).slice(2),
      name: '',
    };

    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              rows: checklist.rows.map((row) =>
                row.id === rowId
                  ? {
                      ...row,
                      resolutions: row.resolutions.map((resolution) =>
                        resolution.id === resolutionId
                          ? {
                              ...resolution,
                              environments: [...resolution.environments, newEnvironment],
                            }
                          : resolution
                      ),
                    }
                  : row
              ),
            }
          : checklist
      )
    );
  };

  const handleAddChecklistResolution = (checklistId: string, rowId: string) => {
    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              rows: checklist.rows.map((row) =>
                row.id === rowId
                  ? {
                      ...row,
                      resolutions: [...row.resolutions, createEmptyChecklistResolution()],
                    }
                  : row
              ),
            }
          : checklist
      )
    );
  };

  const handleAddChecklistRow = (checklistId: string) => {
    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              rows: [...checklist.rows, createEmptyChecklistRow(checklist.rows.length + 1)],
            }
          : checklist
      )
    );
  };


  const handleDeleteChecklistRow = (checklistId: string, rowId: string) => {
    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) => {
        if (checklist.id !== checklistId) return checklist;

        const updatedRows = checklist.rows
          .filter((row) => row.id !== rowId)
          .map((row, index) => ({ ...row, number: index + 1 }));

        return {
          ...checklist,
          rows: updatedRows.length > 0 ? updatedRows : [createEmptyChecklistRow(1)],
        };
      })
    );
  };

  const handleDeleteChecklistResolution = (
    checklistId: string,
    rowId: string,
    resolutionId: string
  ) => {
    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              rows: checklist.rows.map((row) =>
                row.id === rowId
                  ? {
                      ...row,
                      resolutions: row.resolutions.filter(
                        (resolution) => resolution.id !== resolutionId
                      ),
                    }
                  : row
              ),
            }
          : checklist
      )
    );
  };

  const handleDeleteChecklistEnvironment = (
    checklistId: string,
    rowId: string,
    resolutionId: string,
    environmentId: string
  ) => {
    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              rows: checklist.rows.map((row) => {
                if (row.id !== rowId) return row;

                const updatedEnvironmentValues = { ...row.environmentValues };
                delete updatedEnvironmentValues[environmentId];

                return {
                  ...row,
                  environmentValues: updatedEnvironmentValues,
                  resolutions: row.resolutions.map((resolution) =>
                    resolution.id === resolutionId
                      ? {
                          ...resolution,
                          environments: resolution.environments.filter(
                            (environment) => environment.id !== environmentId
                          ),
                        }
                      : resolution
                  ),
                };
              }),
            }
          : checklist
      )
    );
  };

  const handleDeleteChecklistAttachment = (
    checklistId: string,
    rowId: string,
    attachmentId: string
  ) => {
    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              rows: checklist.rows.map((row) =>
                row.id === rowId
                  ? {
                      ...row,
                      attachments: row.attachments.filter(
                        (attachment) => attachment.id !== attachmentId
                      ),
                    }
                  : row
              ),
            }
          : checklist
      )
    );
  };

  const openChecklistPhotoChoiceModal = (checklistId: string, rowId: string) => {
    setSelectedChecklistIdForPhoto(checklistId);
    setSelectedChecklistRowIdForPhoto(rowId);
    setSelectedChecklistPhotoFile(null);
    setIsChecklistPhotoChoiceModalVisible(true);
  };

  const openComputerPhotoModal = () => {
    setSelectedChecklistPhotoFile(null);
    setIsChecklistPhotoChoiceModalVisible(false);
    setIsChecklistComputerPhotoModalVisible(true);
  };

  const openSourcePhotoModal = () => {
    setIsChecklistPhotoChoiceModalVisible(false);
    setIsChecklistSourcePhotoModalVisible(true);
  };

  const closeChecklistPhotoModals = () => {
    setSelectedChecklistIdForPhoto(null);
    setSelectedChecklistRowIdForPhoto(null);
    setSelectedChecklistPhotoFile(null);
    setIsChecklistPhotoChoiceModalVisible(false);
    setIsChecklistComputerPhotoModalVisible(false);
    setIsChecklistSourcePhotoModalVisible(false);
  };

  const handleAddChecklistPhotoFromComputer = () => {
    if (!selectedChecklistIdForPhoto || !selectedChecklistRowIdForPhoto || !selectedChecklistPhotoFile) {
      message.error('Выберите фотографию');
      return;
    }

    const newAttachment: ChecklistAttachment = {
      id: 'attachment-' + Date.now(),
      name: selectedChecklistPhotoFile.name,
      type: 'file',
      file: selectedChecklistPhotoFile,
      filePreviewUrl: URL.createObjectURL(selectedChecklistPhotoFile),
      fileName: selectedChecklistPhotoFile.name,
      fileSize: selectedChecklistPhotoFile.size,
      fileType: selectedChecklistPhotoFile.type || 'image/*',
    };

    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === selectedChecklistIdForPhoto
          ? {
              ...checklist,
              rows: checklist.rows.map((row) =>
                row.id === selectedChecklistRowIdForPhoto
                  ? { ...row, attachments: [...row.attachments, newAttachment] }
                  : row
              ),
            }
          : checklist
      )
    );

    closeChecklistPhotoModals();
    message.success('Фотография добавлена в чек-лист');
  };

  const handleAddChecklistPhotoFromSource = (source: SourceItem) => {
    if (!selectedChecklistIdForPhoto || !selectedChecklistRowIdForPhoto) return;

    const newAttachment: ChecklistAttachment = {
      id: 'attachment-' + Date.now(),
      name: source.fileName || source.name,
      type: source.type,
      content: source.content,
      file: source.file,
      filePreviewUrl: source.filePreviewUrl,
      fileName: source.fileName,
      fileSize: source.fileSize,
      fileType: source.fileType,
    };

    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === selectedChecklistIdForPhoto
          ? {
              ...checklist,
              rows: checklist.rows.map((row) =>
                row.id === selectedChecklistRowIdForPhoto
                  ? { ...row, attachments: [...row.attachments, newAttachment] }
                  : row
              ),
            }
          : checklist
      )
    );

    closeChecklistPhotoModals();
    message.success('Фотография из источников добавлена');
  };

  const handlePreviewChecklistAttachment = (attachment: ChecklistAttachment) => {
    setPreviewSource({
      id: attachment.id,
      projectId: activeProject?.id || '',
      name: attachment.name,
      type: attachment.type,
      content: attachment.content,
      file: attachment.file,
      filePreviewUrl: attachment.filePreviewUrl,
      fileName: attachment.fileName,
      fileSize: attachment.fileSize,
      fileType: attachment.fileType,
      authorId: currentUser?.id || '',
      authorName: currentUser?.name || '',
      createdAt: getCurrentDate(),
      isHidden: false,
    });
    setIsPreviewModalVisible(true);
  };

  const handleHideChecklist = (checklistId: string) => {
    if (!currentUser) return;

    const selectedChecklist = checklists.find((checklist) => checklist.id === checklistId);

    if (!selectedChecklist) return;

    Modal.confirm({
      title: 'Скрыть чек-лист?',
      content:
        'Чек-лист "' +
        selectedChecklist.name +
        '" будет скрыт для обычных пользователей. Администратор сможет его вернуть.',
      okText: 'Скрыть',
      cancelText: 'Отмена',

      onOk: () => {
        setChecklists((prevChecklists) =>
          prevChecklists.map((checklist) =>
            checklist.id === checklistId
              ? {
                  ...checklist,
                  isHidden: true,
                  hiddenById: currentUser.id,
                  hiddenByName: currentUser.name,
                }
              : checklist
          )
        );

        message.success('Чек-лист скрыт');
      },
    });
  };

  const handleRestoreChecklist = (checklistId: string) => {
    const selectedChecklist = checklists.find((checklist) => checklist.id === checklistId);

    if (!selectedChecklist) return;

    Modal.confirm({
      title: 'Вернуть чек-лист?',
      content: 'Чек-лист "' + selectedChecklist.name + '" снова станет доступен пользователям.',
      okText: 'Вернуть',
      cancelText: 'Отмена',

      onOk: () => {
        setChecklists((prevChecklists) =>
          prevChecklists.map((checklist) =>
            checklist.id === checklistId
              ? {
                  ...checklist,
                  isHidden: false,
                  hiddenById: undefined,
                  hiddenByName: undefined,
                }
              : checklist
          )
        );

        message.success('Чек-лист восстановлен');
      },
    });
  };

  const handleDeleteChecklist = (checklistId: string) => {
    if (!isAdmin) {
      message.error('Удалять чек-листы может только администратор');
      return;
    }

    const selectedChecklist = checklists.find((checklist) => checklist.id === checklistId);

    if (!selectedChecklist) return;

    Modal.confirm({
      title: 'Удалить чек-лист?',
      content: 'Чек-лист "' + selectedChecklist.name + '" будет удалён окончательно.',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okType: 'danger',

      onOk: () => {
        setChecklists((prevChecklists) =>
          prevChecklists.filter((checklist) => checklist.id !== checklistId)
        );

        message.success('Чек-лист удалён');
      },
    });
  };

  const resetBugReportCreateForm = () => {
    setBugReportName('');
    setBugReportStatus('new');
    setBugReportPriority('medium');
    setBugReportPrerequisite('');
    setBugReportStepsDescription('');
    setBugReportExpectedResult('');
    setBugReportActualResult('');
  };

  const openBugReportCreateModal = (checklistId?: string, rowId?: string) => {
    if (checklistId && rowId) {
      setSelectedChecklistIdForBugReport(checklistId);
      setSelectedChecklistRowIdForBugReport(rowId);
      setIsChecklistBugReportModalVisible(false);
    } else {
      setSelectedChecklistIdForBugReport(null);
      setSelectedChecklistRowIdForBugReport(null);
    }

    resetBugReportCreateForm();
    setIsBugReportModalVisible(true);
  };

  const closeBugReportCreateModal = () => {
    setIsBugReportModalVisible(false);
    setSelectedChecklistIdForBugReport(null);
    setSelectedChecklistRowIdForBugReport(null);
    resetBugReportCreateForm();
  };

  const attachBugReportToChecklistRow = (
    checklistId: string,
    rowId: string,
    bugReport: BugReportItem
  ) => {
    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              rows: checklist.rows.map((row) =>
                row.id === rowId
                  ? {
                      ...row,
                      bugReportId: bugReport.id,
                      bugReportName: bugReport.name,
                    }
                  : row
              ),
            }
          : checklist
      )
    );
  };

  const handleCreateBugReport = () => {
    if (!currentUser || !activeProject) return;

    if (!bugReportName.trim()) {
      message.error('Введите название баг-репорта');
      return;
    }

    const newBugReport: BugReportItem = {
      id: 'bug-report-' + Date.now() + '-' + Math.random().toString(16).slice(2),
      projectId: activeProject.id,
      name: bugReportName.trim(),
      status: bugReportStatus,
      priority: bugReportPriority,
      prerequisite: bugReportPrerequisite,
      stepsDescription: bugReportStepsDescription,
      expectedResult: bugReportExpectedResult,
      actualResult: bugReportActualResult,
      authorId: currentUser.id,
      authorName: currentUser.name,
      createdAt: getCurrentDate(),
      isHidden: false,
    };

    setBugReports((prevBugReports) => [...prevBugReports, newBugReport]);
    setExpandedBugReportIds((prevIds) => [...prevIds, newBugReport.id]);

    if (selectedChecklistIdForBugReport && selectedChecklistRowIdForBugReport) {
      attachBugReportToChecklistRow(
        selectedChecklistIdForBugReport,
        selectedChecklistRowIdForBugReport,
        newBugReport
      );
      message.success('Баг-репорт создан и прикреплён к чек-листу');
    } else {
      message.success('Баг-репорт создан');
    }

    closeBugReportCreateModal();
  };

  const toggleBugReportExpanded = (bugReportId: string) => {
    setExpandedBugReportIds((prevIds) =>
      prevIds.includes(bugReportId)
        ? prevIds.filter((id) => id !== bugReportId)
        : [...prevIds, bugReportId]
    );
  };

  const handleMoveBugReport = (bugReportId: string, direction: 'up' | 'down') => {
    setBugReports((prevBugReports) => {
      const currentIndex = prevBugReports.findIndex((bugReport) => bugReport.id === bugReportId);

      if (currentIndex === -1) return prevBugReports;

      const currentBugReport = prevBugReports[currentIndex];
      const step = direction === 'up' ? -1 : 1;
      let swapIndex = currentIndex + step;

      while (swapIndex >= 0 && swapIndex < prevBugReports.length) {
        if (prevBugReports[swapIndex].projectId === currentBugReport.projectId) {
          const updatedBugReports = [...prevBugReports];
          [updatedBugReports[currentIndex], updatedBugReports[swapIndex]] = [
            updatedBugReports[swapIndex],
            updatedBugReports[currentIndex],
          ];
          return updatedBugReports;
        }

        swapIndex += step;
      }

      return prevBugReports;
    });
  };

  const handleUpdateBugReportField = <K extends keyof BugReportItem>(
    bugReportId: string,
    field: K,
    value: BugReportItem[K]
  ) => {
    setBugReports((prevBugReports) =>
      prevBugReports.map((bugReport) =>
        bugReport.id === bugReportId ? { ...bugReport, [field]: value } : bugReport
      )
    );

    if (field === 'name') {
      const nextName = String(value);
      setChecklists((prevChecklists) =>
        prevChecklists.map((checklist) => ({
          ...checklist,
          rows: checklist.rows.map((row) =>
            row.bugReportId === bugReportId ? { ...row, bugReportName: nextName } : row
          ),
        }))
      );
    }
  };

  const handleHideBugReport = (bugReportId: string) => {
    if (!currentUser) return;

    const selectedBugReport = bugReports.find((bugReport) => bugReport.id === bugReportId);

    if (!selectedBugReport) return;

    Modal.confirm({
      title: 'Скрыть баг-репорт?',
      content:
        'Баг-репорт "' +
        selectedBugReport.name +
        '" будет скрыт для обычных пользователей. Администратор сможет его вернуть.',
      okText: 'Скрыть',
      cancelText: 'Отмена',

      onOk: () => {
        setBugReports((prevBugReports) =>
          prevBugReports.map((bugReport) =>
            bugReport.id === bugReportId
              ? {
                  ...bugReport,
                  isHidden: true,
                  hiddenById: currentUser.id,
                  hiddenByName: currentUser.name,
                }
              : bugReport
          )
        );

        message.success('Баг-репорт скрыт');
      },
    });
  };

  const handleRestoreBugReport = (bugReportId: string) => {
    const selectedBugReport = bugReports.find((bugReport) => bugReport.id === bugReportId);

    if (!selectedBugReport) return;

    Modal.confirm({
      title: 'Вернуть баг-репорт?',
      content: 'Баг-репорт "' + selectedBugReport.name + '" снова станет доступен пользователям.',
      okText: 'Вернуть',
      cancelText: 'Отмена',

      onOk: () => {
        setBugReports((prevBugReports) =>
          prevBugReports.map((bugReport) =>
            bugReport.id === bugReportId
              ? {
                  ...bugReport,
                  isHidden: false,
                  hiddenById: undefined,
                  hiddenByName: undefined,
                }
              : bugReport
          )
        );

        message.success('Баг-репорт восстановлен');
      },
    });
  };

  const handleDeleteBugReport = (bugReportId: string) => {
    if (!isAdmin) {
      message.error('Удалять баг-репорты может только администратор');
      return;
    }

    const selectedBugReport = bugReports.find((bugReport) => bugReport.id === bugReportId);

    if (!selectedBugReport) return;

    Modal.confirm({
      title: 'Удалить баг-репорт?',
      content: 'Баг-репорт "' + selectedBugReport.name + '" будет удалён окончательно.',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okType: 'danger',

      onOk: () => {
        setBugReports((prevBugReports) =>
          prevBugReports.filter((bugReport) => bugReport.id !== bugReportId)
        );

        setChecklists((prevChecklists) =>
          prevChecklists.map((checklist) => ({
            ...checklist,
            rows: checklist.rows.map((row) =>
              row.bugReportId === bugReportId
                ? { ...row, bugReportId: undefined, bugReportName: undefined }
                : row
            ),
          }))
        );

        message.success('Баг-репорт удалён');
      },
    });
  };

  const openChecklistBugReportModal = (checklistId: string, rowId: string) => {
    setSelectedChecklistIdForBugReport(checklistId);
    setSelectedChecklistRowIdForBugReport(rowId);
    setIsChecklistBugReportModalVisible(true);
  };

  const closeChecklistBugReportModal = () => {
    setSelectedChecklistIdForBugReport(null);
    setSelectedChecklistRowIdForBugReport(null);
    setIsChecklistBugReportModalVisible(false);
  };

  const handleAttachExistingBugReport = (bugReport: BugReportItem) => {
    if (!selectedChecklistIdForBugReport || !selectedChecklistRowIdForBugReport) return;

    attachBugReportToChecklistRow(
      selectedChecklistIdForBugReport,
      selectedChecklistRowIdForBugReport,
      bugReport
    );

    closeChecklistBugReportModal();
    message.success('Баг-репорт прикреплён');
  };

  const handleDetachBugReportFromChecklistRow = (checklistId: string, rowId: string) => {
    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              rows: checklist.rows.map((row) =>
                row.id === rowId
                  ? { ...row, bugReportId: undefined, bugReportName: undefined }
                  : row
              ),
            }
          : checklist
      )
    );
  };

  const openBugReportFromChecklist = (bugReportId?: string) => {
    if (!bugReportId) return;

    setSelectedMenuKey('2');
    setExpandedBugReportIds((prevIds) =>
      prevIds.includes(bugReportId) ? prevIds : [...prevIds, bugReportId]
    );
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
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <Space style={{ marginBottom: 8 }}>
                      <Tag color={source.type === 'text' ? 'blue' : 'green'}>
                        {source.type === 'text' ? 'Текстовый документ' : 'Файл'}
                      </Tag>

                      {source.isHidden && (
                        <Tag color="orange">Скрыто пользователем: {source.hiddenByName}</Tag>
                      )}
                    </Space>

                    <Title
                      level={4}
                      style={{
                        margin: 0,
                        color: '#1f2937',
                        wordBreak: 'break-word',
                      }}
                    >
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
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          overflowWrap: 'anywhere',
                          lineHeight: 1.6,
                        }}
                      >
                        {getShortText(source.content)}
                      </p>
                    )}
                  </div>

                  <Space wrap>
                    {source.type === 'text' && (
                      <>
                        <Button
                          icon={<EyeOutlined />}
                          onClick={() => handlePreviewTextSource(source)}
                          style={{ borderRadius: 10, fontWeight: 600 }}
                        >
                          Просмотр
                        </Button>

                        <Button
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownloadTextSource(source)}
                          style={{ borderRadius: 10, fontWeight: 600 }}
                        >
                          Скачать
                        </Button>
                      </>
                    )}

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

  const renderChecklistsPage = () => {
    const tableHeaderCellStyle: React.CSSProperties = {
      border: '1px solid #d1d5db',
      padding: 8,
      background: '#f8fafc',
      textAlign: 'center',
      verticalAlign: 'middle',
      fontWeight: 700,
    };

    const tableCellStyle: React.CSSProperties = {
      border: '1px solid #d1d5db',
      padding: 8,
      verticalAlign: 'top',
      background: '#ffffff',
    };


    const startChecklistColumnResize = (
      columnKey: ChecklistColumnKey,
      event: React.MouseEvent<HTMLDivElement>
    ) => {
      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startWidth = checklistColumnWidths[columnKey];
      const minWidths: ChecklistColumnWidths = {
        number: 48,
        description: 260,
        status: 150,
        resolution: 320,
        bugReport: 150,
        photos: 170,
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const nextWidth = Math.max(minWidths[columnKey], startWidth + moveEvent.clientX - startX);

        setChecklistColumnWidths((prevWidths) => ({
          ...prevWidths,
          [columnKey]: nextWidth,
        }));
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const renderResizableChecklistHeader = (
      columnKey: ChecklistColumnKey,
      title: string,
      style?: React.CSSProperties
    ) => (
      <th
        style={{
          ...tableHeaderCellStyle,
          ...style,
          width: checklistColumnWidths[columnKey],
          position: 'relative',
          userSelect: 'none',
        }}
      >
        {title}

        <div
          onMouseDown={(event) => startChecklistColumnResize(columnKey, event)}
          title="Потяните, чтобы изменить ширину"
          style={{
            position: 'absolute',
            top: 0,
            right: -3,
            width: 8,
            height: '100%',
            cursor: 'col-resize',
            zIndex: 2,
          }}
        />
      </th>
    );

    if (!activeProject) {
      return (
        <>
          <Title level={1} style={{ margin: 0, fontSize: 36, fontWeight: 700, color: '#002E5F' }}>
            Чек листы
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
          Чек листы проекта <span style={{ color: '#0078d4' }}>{activeProject.name}</span>
        </Title>

        <Space style={{ marginTop: 28, marginBottom: 30 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsChecklistModalVisible(true)}
            style={{
              background: '#0078d4',
              borderColor: '#0078d4',
              height: 42,
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            Создать чек-лист
          </Button>
        </Space>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 'none' }}>
          {activeProjectChecklists.length === 0 ? (
            <Card style={{ borderRadius: 14 }}>
              <Text style={{ color: '#6b7280' }}>Чек-листы пока не созданы.</Text>
            </Card>
          ) : (
            activeProjectChecklists.map((checklist, checklistIndex) => {
              const isExpanded = expandedChecklistIds.includes(checklist.id);

              return (
                <Card
                  key={checklist.id}
                  style={{
                    borderRadius: 14,
                    border: checklist.isHidden ? '1px solid #f59e0b' : '1px solid #e5e7eb',
                    background: checklist.isHidden ? '#fffbeb' : '#ffffff',
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
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <Space style={{ marginBottom: 8 }} wrap>
                        <Tag color="cyan">{checklist.dataType}</Tag>

                        {checklist.isHidden && (
                          <Tag color="orange">Скрыто пользователем: {checklist.hiddenByName}</Tag>
                        )}
                      </Space>

                      <button
                        type="button"
                        onClick={() => toggleChecklistExpanded(checklist.id)}
                        style={{
                          padding: 0,
                          border: 0,
                          background: 'transparent',
                          color: '#0078d4',
                          fontSize: 20,
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          wordBreak: 'break-word',
                          textAlign: 'left',
                        }}
                      >
                        {checklist.name}
                      </button>

                      <Text style={{ display: 'block', color: '#6b7280', marginTop: 6 }}>
                        Автор: {checklist.authorName} · Дата: {checklist.createdAt}
                      </Text>
                    </div>

                    <Space wrap>
                      <Button
                        onClick={() => handleMoveChecklist(checklist.id, 'up')}
                        disabled={checklistIndex === 0}
                        style={{ borderRadius: 10, fontWeight: 600 }}
                      >
                        Выше
                      </Button>

                      <Button
                        onClick={() => handleMoveChecklist(checklist.id, 'down')}
                        disabled={checklistIndex === activeProjectChecklists.length - 1}
                        style={{ borderRadius: 10, fontWeight: 600 }}
                      >
                        Ниже
                      </Button>

                      <Button
                        onClick={() => toggleChecklistExpanded(checklist.id)}
                        style={{ borderRadius: 10, fontWeight: 600 }}
                      >
                        {isExpanded ? 'Свернуть' : 'Развернуть'}
                      </Button>

                      {checklist.isHidden && isAdmin ? (
                        <Button
                          icon={<RollbackOutlined />}
                          onClick={() => handleRestoreChecklist(checklist.id)}
                          style={{ borderRadius: 10, fontWeight: 600 }}
                        >
                          Вернуть
                        </Button>
                      ) : (
                        <Button
                          icon={<EyeInvisibleOutlined />}
                          onClick={() => handleHideChecklist(checklist.id)}
                          style={{ borderRadius: 10, fontWeight: 600 }}
                        >
                          Скрыть
                        </Button>
                      )}

                      {isAdmin && (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteChecklist(checklist.id)}
                          style={{ borderRadius: 10, fontWeight: 600 }}
                        >
                          Удалить
                        </Button>
                      )}
                    </Space>
                  </div>

                  {isExpanded && (
                    <div
                      style={{
                        marginTop: 20,
                        padding: 18,
                        borderRadius: 14,
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <div style={{ overflowX: 'auto', width: '100%' }}>
                        <table
                          style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            tableLayout: 'fixed',
                            minWidth:
                              checklistColumnWidths.number +
                              checklistColumnWidths.description +
                              checklistColumnWidths.status +
                              checklistColumnWidths.resolution +
                              checklistColumnWidths.bugReport +
                              checklistColumnWidths.photos,
                          }}
                        >
                          <colgroup>
                            <col style={{ width: checklistColumnWidths.number }} />
                            <col style={{ width: checklistColumnWidths.description }} />
                            <col style={{ width: checklistColumnWidths.status }} />
                            <col style={{ width: checklistColumnWidths.resolution }} />
                            <col style={{ width: checklistColumnWidths.bugReport }} />
                            <col style={{ width: checklistColumnWidths.photos }} />
                          </colgroup>

                          <thead>
                            <tr>
                              {renderResizableChecklistHeader('number', '№')}
                              {renderResizableChecklistHeader('description', 'Описание')}
                              {renderResizableChecklistHeader('status', 'Статус')}
                              {renderResizableChecklistHeader('resolution', 'Разрешение и окружение')}
                              {renderResizableChecklistHeader('bugReport', 'Ссылка на баг репорт')}
                              {renderResizableChecklistHeader('photos', 'Фотографии')}
                            </tr>
                          </thead>

                          <tbody>
                            {checklist.rows.map((row, rowIndex) => (
                              <tr key={row.id}>
                                <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                    <strong>{row.number}</strong>
                                    <Button
                                      size="small"
                                      onClick={() => handleMoveChecklistRow(checklist.id, row.id, 'up')}
                                      disabled={rowIndex === 0}
                                      style={{ borderRadius: 8, width: 32, padding: 0 }}
                                    >
                                      ↑
                                    </Button>
                                    <Button
                                      size="small"
                                      onClick={() => handleMoveChecklistRow(checklist.id, row.id, 'down')}
                                      disabled={rowIndex === checklist.rows.length - 1}
                                      style={{ borderRadius: 8, width: 32, padding: 0 }}
                                    >
                                      ↓
                                    </Button>
                                    <Button
                                      danger
                                      size="small"
                                      icon={<DeleteOutlined />}
                                      onClick={() => handleDeleteChecklistRow(checklist.id, row.id)}
                                      style={{ borderRadius: 8, width: 32 }}
                                    />
                                  </div>
                                </td>

                                <td style={tableCellStyle}>
                                  <TextArea
                                    value={row.description}
                                    onChange={(event) =>
                                      handleUpdateChecklistRowDescription(
                                        checklist.id,
                                        row.id,
                                        event.target.value
                                      )
                                    }
                                    placeholder="Введите описание проверки"
                                    autoSize={{ minRows: 3, maxRows: 8 }}
                                    style={{ resize: 'none', minHeight: 92, width: '100%' }}
                                  />
                                </td>

                                <td style={tableCellStyle}>
                                  <Select
                                    value={row.status}
                                    options={checklistStatusOptions}
                                    onChange={(value) =>
                                      handleUpdateChecklistRowStatus(checklist.id, row.id, value)
                                    }
                                    style={{ width: '100%' }}
                                  />
                                </td>

                                <td style={tableCellStyle}>
                                  <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', overflowX: 'auto', paddingBottom: 4 }}>
                                    {row.resolutions.map((resolution) => (
                                      <div
                                        key={resolution.id}
                                        style={{
                                          minWidth: 360,
                                          border: '1px solid #e5e7eb',
                                          borderRadius: 10,
                                          overflow: 'hidden',
                                          background: '#f9fafb',
                                          flexShrink: 0,
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: 'flex',
                                            gap: 8,
                                            alignItems: 'center',
                                            padding: 8,
                                            borderBottom: '1px solid #e5e7eb',
                                            background: '#f8fafc',
                                          }}
                                        >
                                          <Input
                                            value={resolution.name}
                                            onChange={(event) =>
                                              handleUpdateChecklistResolutionName(
                                                checklist.id,
                                                row.id,
                                                resolution.id,
                                                event.target.value
                                              )
                                            }
                                            placeholder="Введите разрешение"
                                            style={{ textAlign: 'center', fontWeight: 700 }}
                                          />

                                          <Button
                                            danger
                                            size="small"
                                            icon={<DeleteOutlined />}
                                            onClick={() =>
                                              handleDeleteChecklistResolution(checklist.id, row.id, resolution.id)
                                            }
                                            style={{ borderRadius: 8, flexShrink: 0 }}
                                          />
                                        </div>

                                        <div
                                          style={{
                                            display: 'flex',
                                            gap: 8,
                                            alignItems: 'center',
                                            padding: 8,
                                            overflowX: 'auto',
                                          }}
                                        >
                                          {resolution.environments.map((environment) => (
                                            <div key={environment.id} style={{ minWidth: 130, flexShrink: 0 }}>
                                              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                                                <Input
                                                  value={environment.name}
                                                  onChange={(event) =>
                                                    handleUpdateChecklistEnvironmentName(
                                                      checklist.id,
                                                      row.id,
                                                      resolution.id,
                                                      environment.id,
                                                      event.target.value
                                                    )
                                                  }
                                                  placeholder="Введите окружение"
                                                  style={{ textAlign: 'center', fontWeight: 600 }}
                                                />

                                                <Button
                                                  danger
                                                  size="small"
                                                  icon={<DeleteOutlined />}
                                                  onClick={() =>
                                                    handleDeleteChecklistEnvironment(
                                                      checklist.id,
                                                      row.id,
                                                      resolution.id,
                                                      environment.id
                                                    )
                                                  }
                                                  style={{ borderRadius: 8, flexShrink: 0 }}
                                                />
                                              </div>

                                              <Input
                                                value={row.environmentValues[environment.id] || ''}
                                                onChange={(event) =>
                                                  handleUpdateChecklistEnvironmentValue(
                                                    checklist.id,
                                                    row.id,
                                                    environment.id,
                                                    event.target.value
                                                  )
                                                }
                                                placeholder=""
                                                style={{ minHeight: 38 }}
                                              />
                                            </div>
                                          ))}

                                          <Button
                                            size="small"
                                            onClick={() => handleAddChecklistEnvironment(checklist.id, row.id, resolution.id)}
                                            style={{ borderRadius: 8, fontWeight: 600, flexShrink: 0 }}
                                          >
                                            Добавить окружение
                                          </Button>
                                        </div>
                                      </div>
                                    ))}

                                    <Button
                                      onClick={() => handleAddChecklistResolution(checklist.id, row.id)}
                                      style={{
                                        borderRadius: 10,
                                        fontWeight: 600,
                                        whiteSpace: 'normal',
                                        height: 'auto',
                                        minHeight: 92,
                                        width: 180,
                                        flexShrink: 0,
                                      }}
                                    >
                                      Добавить вкладку с разрешением и браузером
                                    </Button>
                                  </div>
                                </td>

                                <td style={tableCellStyle}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {row.bugReportName ? (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <a
                                          onClick={() => openBugReportFromChecklist(row.bugReportId)}
                                          style={{ color: '#0078d4', fontWeight: 600, cursor: 'pointer', wordBreak: 'break-word' }}
                                        >
                                          {row.bugReportName}
                                        </a>

                                        <Button
                                          danger
                                          size="small"
                                          icon={<DeleteOutlined />}
                                          onClick={() => handleDetachBugReportFromChecklistRow(checklist.id, row.id)}
                                          style={{ borderRadius: 8, flexShrink: 0 }}
                                        />
                                      </div>
                                    ) : (
                                      <Text style={{ color: '#6b7280' }}>Не указана</Text>
                                    )}

                                    <Button
                                      size="small"
                                      onClick={() => openChecklistBugReportModal(checklist.id, row.id)}
                                      style={{ borderRadius: 8, fontWeight: 600, alignSelf: 'flex-start' }}
                                    >
                                      {row.bugReportName ? 'Изменить баг-репорт' : 'Прикрепить баг-репорт'}
                                    </Button>
                                  </div>
                                </td>

                                <td style={tableCellStyle}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {row.attachments.length > 0 ? (
                                      row.attachments.map((attachment) => (
                                        <div
                                          key={attachment.id}
                                          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                                        >
                                          <a
                                            onClick={() => handlePreviewChecklistAttachment(attachment)}
                                            style={{ color: '#0078d4', fontWeight: 600, cursor: 'pointer', wordBreak: 'break-word' }}
                                          >
                                            {attachment.name}
                                          </a>

                                          <Button
                                            danger
                                            size="small"
                                            icon={<DeleteOutlined />}
                                            onClick={() =>
                                              handleDeleteChecklistAttachment(checklist.id, row.id, attachment.id)
                                            }
                                            style={{ borderRadius: 8, flexShrink: 0 }}
                                          />
                                        </div>
                                      ))
                                    ) : (
                                      <Text style={{ color: '#6b7280' }}>Не добавлена</Text>
                                    )}

                                    <Button
                                      size="small"
                                      onClick={() => openChecklistPhotoChoiceModal(checklist.id, row.id)}
                                      style={{ borderRadius: 8, fontWeight: 600, alignSelf: 'flex-start' }}
                                    >
                                      Добавить фотографию
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => handleAddChecklistRow(checklist.id)}
                        style={{ marginTop: 16, borderRadius: 10, fontWeight: 600 }}
                      >
                        Добавить строку
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </>
    );
  };


  const renderBugReportsPage = () => {
    const fieldLabelStyle: React.CSSProperties = {
      display: 'block',
      marginBottom: 6,
      fontWeight: 700,
      color: '#374151',
    };

    if (!activeProject) {
      return (
        <>
          <Title level={1} style={{ margin: 0, fontSize: 36, fontWeight: 700, color: '#002E5F' }}>
            Баг репорты
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
          Баг репорты проекта <span style={{ color: '#0078d4' }}>{activeProject.name}</span>
        </Title>

        <Space style={{ marginTop: 28, marginBottom: 30 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openBugReportCreateModal()}
            style={{
              background: '#0078d4',
              borderColor: '#0078d4',
              height: 42,
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            Создать баг-репорт
          </Button>
        </Space>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 'none' }}>
          {activeProjectBugReports.length === 0 ? (
            <Card style={{ borderRadius: 14 }}>
              <Text style={{ color: '#6b7280' }}>Баг-репорты пока не созданы.</Text>
            </Card>
          ) : (
            activeProjectBugReports.map((bugReport, bugReportIndex) => {
              const isExpanded = expandedBugReportIds.includes(bugReport.id);

              return (
                <Card
                  key={bugReport.id}
                  style={{
                    borderRadius: 14,
                    border: bugReport.isHidden ? '1px solid #f59e0b' : '1px solid #e5e7eb',
                    background: bugReport.isHidden ? '#fffbeb' : '#ffffff',
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
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <Space style={{ marginBottom: 8 }} wrap>
                        <Tag color="red">Баг-репорт</Tag>
                        <Tag color="blue">{getBugReportStatusLabel(bugReport.status)}</Tag>
                        <Tag color={bugReport.priority === 'critical' ? 'red' : bugReport.priority === 'high' ? 'orange' : 'green'}>
                          {getBugReportPriorityLabel(bugReport.priority)}
                        </Tag>

                        {bugReport.isHidden && (
                          <Tag color="orange">Скрыто пользователем: {bugReport.hiddenByName}</Tag>
                        )}
                      </Space>

                      <button
                        type="button"
                        onClick={() => toggleBugReportExpanded(bugReport.id)}
                        style={{
                          padding: 0,
                          border: 0,
                          background: 'transparent',
                          color: '#0078d4',
                          fontSize: 20,
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          wordBreak: 'break-word',
                          textAlign: 'left',
                        }}
                      >
                        {bugReport.name}
                      </button>

                      <Text style={{ display: 'block', color: '#6b7280', marginTop: 6 }}>
                        Автор: {bugReport.authorName} · Дата: {bugReport.createdAt}
                      </Text>
                    </div>

                    <Space wrap>
                      <Button
                        onClick={() => handleMoveBugReport(bugReport.id, 'up')}
                        disabled={bugReportIndex === 0}
                        style={{ borderRadius: 10, fontWeight: 600 }}
                      >
                        Выше
                      </Button>

                      <Button
                        onClick={() => handleMoveBugReport(bugReport.id, 'down')}
                        disabled={bugReportIndex === activeProjectBugReports.length - 1}
                        style={{ borderRadius: 10, fontWeight: 600 }}
                      >
                        Ниже
                      </Button>

                      <Button
                        onClick={() => toggleBugReportExpanded(bugReport.id)}
                        style={{ borderRadius: 10, fontWeight: 600 }}
                      >
                        {isExpanded ? 'Свернуть' : 'Развернуть'}
                      </Button>

                      {bugReport.isHidden && isAdmin ? (
                        <Button
                          icon={<RollbackOutlined />}
                          onClick={() => handleRestoreBugReport(bugReport.id)}
                          style={{ borderRadius: 10, fontWeight: 600 }}
                        >
                          Вернуть
                        </Button>
                      ) : (
                        <Button
                          icon={<EyeInvisibleOutlined />}
                          onClick={() => handleHideBugReport(bugReport.id)}
                          style={{ borderRadius: 10, fontWeight: 600 }}
                        >
                          Скрыть
                        </Button>
                      )}

                      {isAdmin && (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteBugReport(bugReport.id)}
                          style={{ borderRadius: 10, fontWeight: 600 }}
                        >
                          Удалить
                        </Button>
                      )}
                    </Space>
                  </div>

                  {isExpanded && (
                    <div
                      style={{
                        marginTop: 20,
                        padding: 18,
                        borderRadius: 14,
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) 220px 220px', gap: 16 }}>
                        <div>
                          <Text style={fieldLabelStyle}>Название баг репорта</Text>
                          <Input
                            value={bugReport.name}
                            onChange={(event) =>
                              handleUpdateBugReportField(bugReport.id, 'name', event.target.value)
                            }
                            placeholder="Введите название баг-репорта"
                          />
                        </div>

                        <div>
                          <Text style={fieldLabelStyle}>Статус</Text>
                          <Select
                            value={bugReport.status}
                            options={bugReportStatusOptions}
                            onChange={(value) => handleUpdateBugReportField(bugReport.id, 'status', value)}
                            style={{ width: '100%' }}
                          />
                        </div>

                        <div>
                          <Text style={fieldLabelStyle}>Приоритет</Text>
                          <Select
                            value={bugReport.priority}
                            options={bugReportPriorityOptions}
                            onChange={(value) => handleUpdateBugReportField(bugReport.id, 'priority', value)}
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))', gap: 16, marginTop: 16 }}>
                        <div>
                          <Text style={fieldLabelStyle}>Предусловие</Text>
                          <TextArea
                            value={bugReport.prerequisite}
                            onChange={(event) =>
                              handleUpdateBugReportField(bugReport.id, 'prerequisite', event.target.value)
                            }
                            placeholder="Введите предусловие"
                            autoSize={{ minRows: 4, maxRows: 10 }}
                          />
                        </div>

                        <div>
                          <Text style={fieldLabelStyle}>Описание шагов</Text>
                          <TextArea
                            value={bugReport.stepsDescription}
                            onChange={(event) =>
                              handleUpdateBugReportField(bugReport.id, 'stepsDescription', event.target.value)
                            }
                            placeholder="Введите описание шагов"
                            autoSize={{ minRows: 4, maxRows: 10 }}
                          />
                        </div>

                        <div>
                          <Text style={fieldLabelStyle}>Ожидаемый результат</Text>
                          <TextArea
                            value={bugReport.expectedResult}
                            onChange={(event) =>
                              handleUpdateBugReportField(bugReport.id, 'expectedResult', event.target.value)
                            }
                            placeholder="Введите ожидаемый результат"
                            autoSize={{ minRows: 4, maxRows: 10 }}
                          />
                        </div>

                        <div>
                          <Text style={fieldLabelStyle}>Фактический результат</Text>
                          <TextArea
                            value={bugReport.actualResult}
                            onChange={(event) =>
                              handleUpdateBugReportField(bugReport.id, 'actualResult', event.target.value)
                            }
                            placeholder="Введите фактический результат"
                            autoSize={{ minRows: 4, maxRows: 10 }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })
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

    if (selectedMenuKey === '2') {
      return renderBugReportsPage();
    }

    if (selectedMenuKey === '3') {
      return renderChecklistsPage();
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
              maxLength={20}
              showCount
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
          maxLength={20}
          showCount
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
        title={selectedChecklistIdForBugReport ? 'Создание баг-репорта для чек-листа' : 'Создание баг-репорта'}
        open={isBugReportModalVisible}
        onCancel={closeBugReportCreateModal}
        onOk={handleCreateBugReport}
        okText="Создать"
        cancelText="Отмена"
        width={900}
        centered
      >
        <Input
          placeholder="Название баг репорта"
          value={bugReportName}
          onChange={(e) => setBugReportName(e.target.value)}
          style={{ marginBottom: 12 }}
          autoFocus
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <Select
            value={bugReportStatus}
            options={bugReportStatusOptions}
            onChange={setBugReportStatus}
            placeholder="Статус"
          />

          <Select
            value={bugReportPriority}
            options={bugReportPriorityOptions}
            onChange={setBugReportPriority}
            placeholder="Приоритет"
          />
        </div>

        <TextArea
          placeholder="Предусловие"
          value={bugReportPrerequisite}
          onChange={(e) => setBugReportPrerequisite(e.target.value)}
          rows={3}
          style={{ marginBottom: 12 }}
        />

        <TextArea
          placeholder="Описание шагов"
          value={bugReportStepsDescription}
          onChange={(e) => setBugReportStepsDescription(e.target.value)}
          rows={4}
          style={{ marginBottom: 12 }}
        />

        <TextArea
          placeholder="Ожидаемый результат"
          value={bugReportExpectedResult}
          onChange={(e) => setBugReportExpectedResult(e.target.value)}
          rows={3}
          style={{ marginBottom: 12 }}
        />

        <TextArea
          placeholder="Фактический результат"
          value={bugReportActualResult}
          onChange={(e) => setBugReportActualResult(e.target.value)}
          rows={3}
        />
      </Modal>

      <Modal
        title="Прикрепление баг-репорта"
        open={isChecklistBugReportModalVisible}
        onCancel={closeChecklistBugReportModal}
        footer={null}
        width={800}
        centered
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() =>
              selectedChecklistIdForBugReport && selectedChecklistRowIdForBugReport
                ? openBugReportCreateModal(selectedChecklistIdForBugReport, selectedChecklistRowIdForBugReport)
                : openBugReportCreateModal()
            }
            style={{ background: '#0078d4', borderColor: '#0078d4', borderRadius: 10, fontWeight: 600 }}
          >
            Создать новый баг-репорт
          </Button>
        </Space>

        {activeProjectBugReports.length === 0 ? (
          <Text style={{ color: '#6b7280' }}>В проекте пока нет баг-репортов.</Text>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeProjectBugReports.map((bugReport) => (
              <Card key={bugReport.id} size="small" style={{ borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <div style={{ minWidth: 0 }}>
                    <a
                      onClick={() => openBugReportFromChecklist(bugReport.id)}
                      style={{ color: '#0078d4', fontWeight: 700, cursor: 'pointer', wordBreak: 'break-word' }}
                    >
                      {bugReport.name}
                    </a>

                    <div style={{ marginTop: 6 }}>
                      <Tag color="blue">{getBugReportStatusLabel(bugReport.status)}</Tag>
                      <Tag color={bugReport.priority === 'critical' ? 'red' : bugReport.priority === 'high' ? 'orange' : 'green'}>
                        {getBugReportPriorityLabel(bugReport.priority)}
                      </Tag>
                    </div>
                  </div>

                  <Button
                    type="primary"
                    onClick={() => handleAttachExistingBugReport(bugReport)}
                    style={{ borderRadius: 10, fontWeight: 600, background: '#0078d4', borderColor: '#0078d4', flexShrink: 0 }}
                  >
                    Прикрепить
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Modal>

      <Modal
        title="Создание чек-листа"
        open={isChecklistModalVisible}
        onCancel={() => {
          setIsChecklistModalVisible(false);
          resetChecklistCreateForm();
        }}
        onOk={handleCreateChecklist}
        okText="Создать"
        cancelText="Отмена"
        centered
      >
        <Input
          placeholder="Название чек-листа"
          value={checklistName}
          onChange={(e) => setChecklistName(e.target.value)}
          style={{ marginBottom: 12 }}
          autoFocus
        />

        <Input
          placeholder="Тип данных"
          value={checklistDataType}
          onChange={(e) => setChecklistDataType(e.target.value)}
        />
      </Modal>

      <Modal
        title="Добавление фотографии"
        open={isChecklistPhotoChoiceModalVisible}
        onCancel={closeChecklistPhotoModals}
        footer={null}
        centered
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '12px 0' }}>
          <Button
            size="large"
            block
            onClick={openComputerPhotoModal}
            style={{ borderRadius: 10, fontWeight: 600 }}
          >
            Добавить фотографию с компьютера
          </Button>

          <Button
            size="large"
            block
            onClick={openSourcePhotoModal}
            style={{ borderRadius: 10, fontWeight: 600 }}
          >
            Добавить фотографию из источников
          </Button>
        </div>
      </Modal>

      <Modal
        title="Добавление фотографии с компьютера"
        open={isChecklistComputerPhotoModalVisible}
        onCancel={closeChecklistPhotoModals}
        onOk={handleAddChecklistPhotoFromComputer}
        okText="Добавить"
        cancelText="Отмена"
        centered
      >
        <Dragger
          multiple={false}
          maxCount={1}
          accept="image/*"
          beforeUpload={(file) => {
            setSelectedChecklistPhotoFile(file);
            return false;
          }}
          onRemove={() => {
            setSelectedChecklistPhotoFile(null);
            return true;
          }}
          fileList={
            selectedChecklistPhotoFile
              ? [
                  {
                    uid: 'selected-checklist-photo',
                    name: selectedChecklistPhotoFile.name,
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
            Нажмите или перетащите фотографию в эту область
          </p>

          <p className="ant-upload-hint">
            Фотография будет прикреплена к выбранной строке чек-листа.
          </p>
        </Dragger>
      </Modal>

      <Modal
        title="Выбор фотографии из источников"
        open={isChecklistSourcePhotoModalVisible}
        onCancel={closeChecklistPhotoModals}
        footer={null}
        width={800}
        centered
      >
        {activeProjectPhotoSources.length === 0 ? (
          <Text style={{ color: '#6b7280' }}>В источниках нет фотографий.</Text>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeProjectPhotoSources.map((source) => (
              <Card key={source.id} size="small" style={{ borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <div>
                    <a
                      onClick={() => handlePreviewSourceFile(source)}
                      style={{ color: '#0078d4', fontWeight: 700, cursor: 'pointer' }}
                    >
                      {source.fileName || source.name}
                    </a>
                  </div>

                  <Button
                    type="primary"
                    onClick={() => handleAddChecklistPhotoFromSource(source)}
                    style={{ borderRadius: 10, fontWeight: 600, background: '#0078d4', borderColor: '#0078d4' }}
                  >
                    Добавить
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
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
        {previewSource?.type === 'text' ? (
          <div
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
              maxHeight: '70vh',
              overflowY: 'auto',
              padding: 16,
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              background: '#f9fafb',
              color: '#374151',
              lineHeight: 1.6,
            }}
          >
            {previewSource.content}
          </div>
        ) : previewSource?.filePreviewUrl && previewSource.fileType?.startsWith('image/') ? (
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
