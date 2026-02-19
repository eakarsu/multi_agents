import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, IconButton, Drawer, List, ListItem,
  ListItemIcon, ListItemText, ListItemButton, useMediaQuery, useTheme,
  Avatar, Menu, MenuItem, Divider, Badge
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, People, SmartToy, Assignment, Description,
  Chat, Assessment, Extension, Notifications as NotifIcon, Person,
  Lock, Logout, ChevronLeft, Home
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Dashboard', icon: Dashboard, path: '/dashboard' },
  { label: 'Users', icon: People, path: '/users' },
  { label: 'Agents', icon: SmartToy, path: '/agents' },
  { label: 'Tasks', icon: Assignment, path: '/tasks' },
  { label: 'Templates', icon: Description, path: '/templates' },
  { label: 'Conversations', icon: Chat, path: '/conversations' },
  { label: 'Reports', icon: Assessment, path: '/reports' },
  { label: 'Integrations', icon: Extension, path: '/integrations' },
  { label: 'Notifications', icon: NotifIcon, path: '/notifications' },
];

export default function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [userMenu, setUserMenu] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserMenu(null);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', cursor: 'pointer' }} onClick={() => navigate('/')}>
          CraftAgent
        </Typography>
        {isMobile && <IconButton onClick={() => setDrawerOpen(false)}><ChevronLeft /></IconButton>}
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1, px: 1 }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton onClick={() => { navigate(item.path); if (isMobile) setDrawerOpen(false); }}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? 'primary.light' : 'transparent',
                  '&:hover': { bgcolor: active ? 'primary.light' : 'action.hover' }
                }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Icon sx={{ color: active ? 'primary.main' : 'text.secondary', fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{
                  fontSize: '0.875rem', fontWeight: active ? 600 : 400, color: active ? 'primary.main' : 'text.primary'
                }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List sx={{ px: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/')} sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}><Home sx={{ fontSize: 22 }} /></ListItemIcon>
            <ListItemText primary="Landing Page" primaryTypographyProps={{ fontSize: '0.875rem' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={1}
        sx={{
          bgcolor: 'rgba(254,247,255,0.95)', backdropFilter: 'blur(10px)', color: 'text.primary',
          width: { md: `calc(100% - ${drawerOpen ? DRAWER_WIDTH : 0}px)` },
          ml: { md: `${drawerOpen ? DRAWER_WIDTH : 0}px` },
          transition: 'width 0.3s, margin 0.3s'
        }}>
        <Toolbar>
          <IconButton edge="start" onClick={() => setDrawerOpen(!drawerOpen)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ flex: 1 }} />
          <IconButton onClick={(e) => setUserMenu(e.currentTarget)}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
          </IconButton>
          <Menu anchorEl={userMenu} open={!!userMenu} onClose={() => setUserMenu(null)}>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="body2" fontWeight={600}>{user?.firstName} {user?.lastName}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { navigate('/profile'); setUserMenu(null); }}>
              <ListItemIcon><Person fontSize="small" /></ListItemIcon>Profile
            </MenuItem>
            <MenuItem onClick={() => { navigate('/change-password'); setUserMenu(null); }}>
              <ListItemIcon><Lock fontSize="small" /></ListItemIcon>Change Password
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><Logout fontSize="small" /></ListItemIcon>Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer variant={isMobile ? 'temporary' : 'persistent'} open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: DRAWER_WIDTH, flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', borderRight: '1px solid', borderColor: 'divider' }
        }}>
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{
        flexGrow: 1, bgcolor: 'background.default',
        ml: { md: drawerOpen ? 0 : `-${DRAWER_WIDTH}px` },
        width: { md: `calc(100% - ${drawerOpen ? DRAWER_WIDTH : 0}px)` },
        transition: 'margin 0.3s, width 0.3s', minHeight: '100vh'
      }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
