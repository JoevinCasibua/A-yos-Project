import { 
  LayoutDashboard, 
  Users, 
  User,
  Briefcase, 
  Calendar, 
  Wrench, 
  CreditCard, 
  Star, 
  Headset, 
  FileBarChart, 
  BarChart3, 
  Bell, 
  ShieldCheck, 
  ClipboardList, 
  Trash2, 
  Settings, 
  UserCircle,
  LogOut,
  ChevronDown,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  PieChart,
  MessageSquare,
  Activity,
  Megaphone
} from 'lucide-react';

const icons = {
  LayoutDashboard, Users, User, Briefcase, Calendar, Wrench, CreditCard,
  Star, Headset, FileBarChart, BarChart3, Bell, ShieldCheck, ClipboardList,
  Trash2, Settings, UserCircle, LogOut, ChevronDown, Menu, X, PanelLeftClose,
  PanelLeftOpen, PieChart, MessageSquare, Activity, Megaphone
};

Object.entries(icons).forEach(([key, val]) => {
  if (!val) {
    console.error("UNDEFINED ICON:", key);
  }
});
console.log("Check complete.");
