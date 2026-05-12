import React, { useState } from 'react';
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
  AutoComplete,        // ← Добавили импорт
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
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

const App: React.FC = () => {
  const [projects, setProjects] = useState<string[]>([
    'Проект 1', 'Проект 2', 'Проект 3', 'Проект 4', 'Проект 5', 'Проект 6',
  ]);
  const [activeProject, setActiveProject] = useState<string>('Проект 1');
  const [searchValue, setSearchValue] = useState('');
  const [selectedMenuKey, setSelectedMenuKey] = useState<string>('1');

  // Модальные окна
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProjectClick = () => {
    setIsModalVisible(true);
  };

  const handleCreateNewProject = () => {
    if (!newProjectName.trim()) {
      message.error('Введите название проекта');
      return;
    }

    const trimmedName = newProjectName.trim();
    if (projects.includes(trimmedName)) {
      message.error('Проект с таким названием уже существует');
      return;
    }

    setProjects([...projects, trimmedName]);
    setActiveProject(trimmedName);
    setNewProjectName('');
    setIsCreateModalVisible(false);
    setIsModalVisible(false);
    message.success(`Проект "${trimmedName}" успешно создан`);
  };

  const handleJoinProject = () => {
    setIsModalVisible(false);
    message.info('Функция "Присоединиться к проекту" в разработке');
  };

  const handleDeleteProject = (projectToDelete: string) => {
    if (projects.length === 1) return;
    const newProjects = projects.filter(p => p !== projectToDelete);
    setProjects(newProjects);
    if (activeProject === projectToDelete) {
      setActiveProject(newProjects[0]);
    }
  };

  const tabItems: TabsProps['items'] = projects.map((project) => ({
    key: project,
    label: project,
    closable: projects.length > 1,
  }));

  const menuItems = [
    { key: '1', icon: <FileTextOutlined />, label: 'Тест кейсы' },
    { key: '2', icon: <BugOutlined />, label: 'Баг репорты' },
    { key: '3', icon: <CheckSquareOutlined />, label: 'Чек листы' },
    { key: '4', icon: <AuditOutlined />, label: 'Проверки' },
    { key: '5', icon: <LinkOutlined />, label: 'Ссылки' },
    { key: '6', icon: <FolderOpenOutlined />, label: 'Источники' },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
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
        }}
      >
        {/* Логотип */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, width: 228 }}>
          <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-2px' }}>Н</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.5px' }}>НОРНИКЕЛЬ</div>
            <div style={{ fontSize: 11.5, color: '#a0c0ff', marginTop: -2 }}>ЗАВОДСКОЙ ФИЛИАЛ</div>
          </div>
        </div>

        {/* Кнопка "Создать проект" */}
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
            marginLeft: '10px',
          }}
        >
          Создать проект
        </Button>

        {/* Табы проектов */}
        <div style={{ 
          flex: 1, 
          minWidth: 0, 
          overflowX: 'auto',
          padding: '8px 0',
        }}>
          <Tabs
            type="editable-card"
            hideAdd
            activeKey={activeProject}
            onChange={setActiveProject}
            onEdit={(key, action) => {
              if (action === 'remove') handleDeleteProject(key as string);
            }}
            items={tabItems}
            style={{ marginBottom: 0 }}
            tabBarStyle={{ marginBottom: 0, color: '#fff' }}
            tabBarGutter={8}
            size="large"
          />
        </div>

        {/* Поиск */}
        <AutoComplete
          value={searchValue}
          onChange={setSearchValue}
          options={projects
            .filter(p => p.toLowerCase().includes(searchValue.toLowerCase()))
            .map(p => ({ value: p }))}
          style={{ height: 48, width: 300, flexShrink: 0 }}
          onSelect={(value) => {
            setActiveProject(value);
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

        {/* Пользователь */}
        <Dropdown trigger={['click']}>
          <Space style={{ 
            cursor: 'pointer', 
            padding: '4px 12px', 
            borderRadius: 8,
            flexShrink: 0,
          }}>
            <Avatar icon={<UserOutlined />} size={44} style={{ backgroundColor: '#0078d4' }} />
            <div style={{ color: '#fff', lineHeight: 1.3 }}>
              <div style={{ fontWeight: 500 }}>Иванов И. И.</div>
              <Text style={{ fontSize: 12.5, color: '#b0d0ff' }}>Пользователь</Text>
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
            style={{ 
              background: 'transparent', 
              borderRight: 0, 
              marginTop: 12,
              padding: '0 8px',
            }}
          />

          <div style={{
            position: 'absolute',
            bottom: 32,
            left: 24,
            right: 24,
            fontSize: 13.5,
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.85)',
          }}>
            Единая служба поддержки сервисов<br />
            <strong>8 (800) 700-59-11</strong><br />
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
            <Title level={1} style={{ margin: 0, fontSize: 36, fontWeight: 700, color: '#002E5F' }}>
              Добро пожаловать в <span style={{ color: '#0078d4' }}>{activeProject}</span>
            </Title>
            
            <p style={{ fontSize: 18, color: '#555', marginTop: 20, maxWidth: 680 }}>
              Выберите нужный раздел в меню слева, чтобы начать работу с проектом.
            </p>
          </div>
        </Content>
      </Layout>

      {/* Модальное окно выбора действия */}
      <Modal
        title="Действие с проектом"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px 0' }}>
          <Button
            type="primary"
            size="large"
            block
            onClick={() => {
              setIsModalVisible(false);
              setIsCreateModalVisible(true);
            }}
          >
            Создать новый проект
          </Button>

          <Button
            size="large"
            block
            onClick={handleJoinProject}
          >
            Присоединиться к существующему проекту
          </Button>
        </div>
      </Modal>

      {/* Модальное окно ввода названия */}
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
    </Layout>
  );
};

export default App;
