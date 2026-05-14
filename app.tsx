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
} from '@ant-design/icons';

import logo from './assets/logo.png';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

type UserRole = 'admin' | 'user';

type ProjectUser = {
  id: string;
  name: string;
  role: UserRole;
};

type Project = {
  id: string;
  name: string;
  role: UserRole;
  users: ProjectUser[];
};

const CURRENT_USER_ID = 'current-user';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Проект 1',
      role: 'admin',
      users: [
        { id: CURRENT_USER_ID, name: 'Иванов И. И.', role: 'admin' },
        { id: '2', name: 'Петров П. П.', role: 'user' },
        { id: '3', name: 'Сидоров С. С.', role: 'user' },
      ],
    },
    {
      id: '2',
      name: 'Проект 2',
      role: 'user',
      users: [
        { id: '4', name: 'Смирнов А. А.', role: 'admin' },
        { id: CURRENT_USER_ID, name: 'Иванов И. И.', role: 'user' },
      ],
    },
  ]);

  const [activeProjectId, setActiveProjectId] = useState<string>('1');
  const [searchValue, setSearchValue] = useState('');
  const [selectedMenuKey, setSelectedMenuKey] = useState<string>('1');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);

  const [newProjectName, setNewProjectName] = useState('');
  const [joinProjectName, setJoinProjectName] = useState('');

  const activeProject =
    projects.find((project) => project.id === activeProjectId) || projects[0];

  useEffect(() => {
    if (activeProject?.role !== 'admin' && selectedMenuKey === 'users') {
      setSelectedMenuKey('1');
    }
  }, [activeProject, selectedMenuKey]);

  const handleCreateProjectClick = () => {
    setIsModalVisible(true);
  };

  const handleCreateNewProject = () => {
    if (!newProjectName.trim()) {
      message.error('Введите название проекта');
      return;
    }

    const trimmedName = newProjectName.trim();

    if (projects.some((project) => project.name === trimmedName)) {
      message.error('Проект с таким названием уже существует');
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: trimmedName,
      role: 'admin',
      users: [
        {
          id: CURRENT_USER_ID,
          name: 'Иванов И. И.',
          role: 'admin',
        },
      ],
    };

    setProjects([...projects, newProject]);
    setActiveProjectId(newProject.id);
    setNewProjectName('');
    setIsCreateModalVisible(false);
    setIsModalVisible(false);

    message.success('Проект "' + trimmedName + '" создан');
  };

  const handleJoinProject = () => {
    if (!joinProjectName.trim()) {
      message.error('Введите название проекта');
      return;
    }

    const trimmedName = joinProjectName.trim();

    if (projects.some((project) => project.name === trimmedName)) {
      message.error('Вы уже состоите в этом проекте');
      return;
    }

    const joinedProject: Project = {
      id: Date.now().toString(),
      name: trimmedName,
      role: 'user',
      users: [
        {
          id: 'admin-' + Date.now(),
          name: 'Администратор проекта',
          role: 'admin',
        },
        {
          id: CURRENT_USER_ID,
          name: 'Иванов И. И.',
          role: 'user',
        },
      ],
    };

    setProjects([...projects, joinedProject]);
    setActiveProjectId(joinedProject.id);
    setJoinProjectName('');
    setIsJoinModalVisible(false);
    setIsModalVisible(false);

    message.success(
      'Вы присоединились к проекту "' + trimmedName + '"'
    );
  };

  const handleDeleteProject = (projectId: string) => {
    if (projects.length === 1) return;

    const projectToDelete = projects.find(
      (project) => project.id === projectId
    );

    if (projectToDelete?.role !== 'admin') {
      message.error(
        'Удалять проект может только администратор'
      );
      return;
    }

    const newProjects = projects.filter(
      (project) => project.id !== projectId
    );

    setProjects(newProjects);

    if (activeProjectId === projectId) {
      setActiveProjectId(newProjects[0].id);
    }
  };

  const handleTransferAdminRights = (userId: string) => {
    if (!activeProject || activeProject.role !== 'admin') return;

    Modal.confirm({
      title: 'Передать права администратора?',
      content:
        'После передачи прав вы станете обычным пользователем проекта.',
      okText: 'Передать',
      cancelText: 'Отмена',

      onOk: () => {
        setProjects((prevProjects) =>
          prevProjects.map((project) => {
            if (project.id !== activeProject.id) return project;

            return {
              ...project,
              role: 'user',

              users: project.users.map((user) => {
                if (user.id === userId) {
                  return {
                    ...user,
                    role: 'admin',
                  };
                }

                if (user.id === CURRENT_USER_ID) {
                  return {
                    ...user,
                    role: 'user',
                  };
                }

                return {
                  ...user,
                  role: 'user',
                };
              }),
            };
          })
        );

        setSelectedMenuKey('1');

        message.success(
          'Права администратора успешно переданы'
        );
      },
    });
  };

  const tabItems: TabsProps['items'] = projects.map(
    (project) => ({
      key: project.id,
      label: project.name,
      closable: projects.length > 1,
    })
  );

  const menuItems = [
    {
      key: '1',
      icon: <FileTextOutlined />,
      label: 'Тест кейсы',
    },
    {
      key: '2',
      icon: <BugOutlined />,
      label: 'Баг репорты',
    },
    {
      key: '3',
      icon: <CheckSquareOutlined />,
      label: 'Чек листы',
    },
    {
      key: '4',
      icon: <AuditOutlined />,
      label: 'Проверки',
    },
    {
      key: '5',
      icon: <LinkOutlined />,
      label: 'Ссылки',
    },
    {
      key: '6',
      icon: <FolderOpenOutlined />,
      label: 'Источники',
    },

    ...(activeProject?.role === 'admin'
      ? [
          {
            key: 'users',
            icon: <TeamOutlined />,
            label: 'Пользователи',
          },
        ]
      : []),
  ];

  const renderContent = () => {
    if (
      selectedMenuKey === 'users' &&
      activeProject?.role === 'admin'
    ) {
      return (
        <>
          <Title
            level={1}
            style={{
              margin: 0,
              fontSize: 36,
              fontWeight: 700,
              color: '#002E5F',
            }}
          >
            Пользователи проекта{' '}
            <span style={{ color: '#0078d4' }}>
              {activeProject.name}
            </span>
          </Title>

          <div
            style={{
              marginTop: 32,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              maxWidth: 820,
            }}
          >
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
                }}
              >
                <Space size={14}>
                  <Avatar
                    icon={<UserOutlined />}
                    size={42}
                    style={{
                      backgroundColor:
                        user.role === 'admin'
                          ? '#003087'
                          : '#0078d4',
                    }}
                  />

                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: '#1f2937',
                      }}
                    >
                      {user.name}
                    </div>

                    <Text
                      style={{
                        fontSize: 13,
                        color:
                          user.role === 'admin'
                            ? '#003087'
                            : '#6b7280',
                      }}
                    >
                      {user.role === 'admin'
                        ? 'Администратор'
                        : 'Пользователь'}
                    </Text>
                  </div>
                </Space>

                {user.role === 'admin' ? (
                  <Space>
                    <CrownOutlined
                      style={{
                        color: '#003087',
                      }}
                    />

                    <Text
                      style={{
                        color: '#003087',
                        fontWeight: 600,
                      }}
                    >
                      Администратор
                    </Text>
                  </Space>
                ) : (
                  <Button
                    type="primary"
                    onClick={() =>
                      handleTransferAdminRights(user.id)
                    }
                    style={{
                      background: '#0078d4',
                      borderColor: '#0078d4',
                      borderRadius: 10,
                      fontWeight: 600,
                    }}
                  >
                    Передать права
                  </Button>
                )}
              </div>
            ))}
          </div>
        </>
      );
    }

    return (
      <>
        <Title
          level={1}
          style={{
            margin: 0,
            fontSize: 36,
            fontWeight: 700,
            color: '#002E5F',
          }}
        >
          Добро пожаловать в{' '}
          <span style={{ color: '#0078d4' }}>
            {activeProject?.name}
          </span>
        </Title>

        <p
          style={{
            fontSize: 18,
            color: '#555',
            marginTop: 20,
            maxWidth: 680,
          }}
        >
          Выберите нужный раздел в меню слева,
          чтобы начать работу с проектом.
        </p>
      </>
    );
  };

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: '#f5f7fa',
      }}
    >
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            width: 260,
            marginRight: -6,
          }}
        >
          <img
            src={logo}
            alt="Норникель"
            style={{
              height: 56,
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateProjectClick}
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
          style={{
            flex: 1,
            minWidth: 0,
            maxWidth: '100%',
            overflowX: 'auto',
            overflowY: 'hidden',
            padding: '8px 0 4px',
            scrollbarWidth: 'thin',
            scrollbarColor:
              '#ffffff80 transparent',
          }}
        >
          <div
            style={{
              minWidth: 'max-content',
            }}
          >
            <Tabs
              type="editable-card"
              hideAdd
              activeKey={activeProjectId}
              onChange={setActiveProjectId}
              onEdit={(key, action) => {
                if (action === 'remove') {
                  handleDeleteProject(
                    key as string
                  );
                }
              }}
              items={tabItems}
              style={{
                marginBottom: 0,
                whiteSpace: 'nowrap',
              }}
              tabBarStyle={{
                marginBottom: 0,
                color: '#fff',
              }}
              tabBarGutter={8}
              size="large"
            />
          </div>
        </div>

        <AutoComplete
          value={searchValue}
          onChange={setSearchValue}
          options={projects
            .filter((project) =>
              project.name
                .toLowerCase()
                .includes(
                  searchValue.toLowerCase()
                )
            )
            .map((project) => ({
              value: project.name,
              label: project.name,
            }))}
          style={{
            height: 48,
            width: 300,
            flexShrink: 0,
          }}
          onSelect={(value) => {
            const foundProject =
              projects.find(
                (project) =>
                  project.name === value
              );

            if (foundProject) {
              setActiveProjectId(
                foundProject.id
              );
            }

            setSearchValue('');
          }}
        >
          <Input
            placeholder="Поиск по проектам..."
            style={{
              height: 48,
              borderRadius: 12,
              padding: '0 16px',
            }}
          />
        </AutoComplete>

        <Dropdown
          trigger={['click']}
          menu={{
            items: [
              {
                key: 'profile',
                label: 'Профиль',
              },
              {
                key: 'settings',
                label: 'Настройки',
              },
              {
                key: 'logout',
                label: 'Выйти',
              },
            ],
          }}
        >
          <Space
            style={{
              cursor: 'pointer',
              padding: '4px 12px',
              borderRadius: 8,
              flexShrink: 0,
            }}
          >
            <Avatar
              icon={<UserOutlined />}
              size={44}
              style={{
                backgroundColor:
                  '#0078d4',
              }}
            />

            <div
              style={{
                color: '#fff',
                lineHeight: 1.25,
                minWidth: 100,
              }}
            >
              <div
                style={{
                  fontWeight: 500,
                }}
              >
                Иванов И. И.
              </div>

              <Text
                style={{
                  fontSize: 12.5,
                  color: '#b0d0ff',
                }}
              >
                {activeProject?.role ===
                'admin'
                  ? 'Администратор'
                  : 'Пользователь'}
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
            background:
              'linear-gradient(to bottom, #003087, #006d7a)',
            boxShadow:
              '2px 0 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedMenuKey]}
            items={menuItems}
            onClick={({ key }) =>
              setSelectedMenuKey(key)
            }
            style={{
              background: 'transparent',
              borderRight: 0,
              marginTop: 12,
              padding: '0 8px',
            }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: 32,
              left: 24,
              right: 24,
              fontSize: 13.5,
              lineHeight: 1.6,
              color:
                'rgba(255,255,255,0.85)',
            }}
          >
            Единая служба поддержки
            сервисов
            <br />
            <strong>
              8 (800) 700-59-11
            </strong>
            <br />
            5911@nornik.ru
          </div>
        </Sider>

        <Content
          style={{
            padding: 0,
            background: '#f5f7fa',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              minHeight:
                'calc(100vh - 72px)',
              padding: '56px 68px',
              boxShadow:
                '0 4px 12px rgba(0, 0, 0, 0.06)',
            }}
          >
            {renderContent()}
          </div>
        </Content>
      </Layout>

      <Modal
        title="Действие с проектом"
        open={isModalVisible}
        onCancel={() =>
          setIsModalVisible(false)
        }
        footer={null}
        centered
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            padding: '20px 0',
          }}
        >
          <Button
            type="primary"
            size="large"
            block
            onClick={() => {
              setIsModalVisible(false);
              setIsCreateModalVisible(
                true
              );
            }}
          >
            Создать новый проект
          </Button>

          <Button
            size="large"
            block
            onClick={() => {
              setIsModalVisible(false);
              setIsJoinModalVisible(
                true
              );
            }}
          >
            Присоединиться к существующему
            проекту
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
          onChange={(e) =>
            setNewProjectName(
              e.target.value
            )
          }
          onPressEnter={
            handleCreateNewProject
          }
          style={{
            marginTop: 8,
          }}
          autoFocus
        />
      </Modal>

      <Modal
        title="Присоединение к проекту"
        open={isJoinModalVisible}
        onCancel={() => {
          setIsJoinModalVisible(false);
          setJoinProjectName('');
        }}
        onOk={handleJoinProject}
        okText="Присоединиться"
        cancelText="Отмена"
        centered
      >
        <Input
          placeholder="Введите название существующего проекта"
          value={joinProjectName}
          onChange={(e) =>
            setJoinProjectName(
              e.target.value
            )
          }
          onPressEnter={handleJoinProject}
          style={{
            marginTop: 8,
          }}
          autoFocus
        />
      </Modal>
    </Layout>
  );
};

export default App;
