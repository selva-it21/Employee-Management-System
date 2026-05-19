import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  Calendar,
  DollarSign,
  FileText,
  LayoutGrid,
  Menu,
  Settings,
  User,
  X,
  ChevronRight,
  LogOut
} from 'lucide-react'
import { dummyProfileData } from '../assets/assets'

const Sidebar = () => {

  const { pathname } = useLocation()
  const [userName, setUserName] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setUserName(
      dummyProfileData.firstName + " " + dummyProfileData.lastName
    )
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const role = "EMPLOYEE"

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    role === "ADMIN"
      ? { name: "Employees", href: "/employees", icon: User }
      : { name: "Attendance", href: "/attendance", icon: Calendar },
    { name: "Leave", href: "/leave", icon: FileText },
    { name: "Payslips", href: "/payslips", icon: DollarSign },
    { name: "Settings", href: "/settings", icon: Settings }
  ]

  const handleLogout = () => {
    window.location.href = "/login"
  }

  return (
    <>
      {/* Mobile button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg"
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col h-screen w-[260px] bg-gradient-to-b from-slate-900 to-slate-950 text-white">

        {/* Header */}
        <div className="px-5 pt-6 pb-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="text-white size-7" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Employee MS
                </p>
                <p className="text-xs text-slate-400">
                  Management System
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile */}
        {userName && (
          <div className="mx-3 mt-4 mb-2 p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center">
                <span className="text-xs text-white font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-200">{userName}</p>
                <p className="text-xs text-slate-400">
                  {role === "ADMIN" ? "Administrator" : "Employee"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation label */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-[10px] uppercase tracking-widest text-slate-400">
            Navigation
          </p>
        </div>

        {/* Nav Items */}
        <div className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] transition-all relative ${
                  isActive
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-500 rounded-r-full" />
                )}

                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? "text-indigo-300"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                />

                <span className="flex-1">{item.name}</span>

                {isActive && (
                  <ChevronRight className="w-4 h-4 text-indigo-400" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-[13px] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>

      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-slate-900 to-slate-950 text-white z-50 flex flex-col transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="p-4 text-slate-400"
        >
          <X />
        </button>

        {/* Same content */}
        <div className="flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 ${
                  isActive ? "text-indigo-300" : "text-slate-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            )
          })}
        </div>

      </aside>
    </>
  )
}

export default Sidebar