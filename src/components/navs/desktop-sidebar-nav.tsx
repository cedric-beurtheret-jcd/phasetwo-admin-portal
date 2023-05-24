import { Listbox, Popover } from "@headlessui/react";
import cs from "classnames";
import Button from "components/elements/forms/buttons/button";
import { config } from "config";
import useUser from "components/utils/useUser";
import { keycloakService } from "keycloak";
import { ExternalLink, Monitor, Moon, Sun } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { ChevronIcon, DoubleSlashBrandIcon, FullBrandIcon } from "../icons";
import { NavigationItem } from "../layouts/layout";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Gravatar from 'react-gravatar';

type Props = {
  menuCollapsed: boolean;
  setMenuCollapsed: (collapsed: boolean) => void;
  navigation: NavigationItem[];
};

const themes = [
  {
    key: "system",
    name: "system",
    icon: <Monitor className="h-4 w-4" />,
  },
  {
    key: "light",
    name: "light",
    icon: <Sun className="h-4 w-4" />,
  },
  {
    key: "dark",
    name: "dark",
    icon: <Moon className="h-4 w-4" />,
  },
];

const DesktopSidebarNav: React.FC<Props> = ({
  menuCollapsed,
  setMenuCollapsed,
  navigation,
}) => {
  const { user, fullName } = useUser();
  const [theme, setTheme] = useState(("theme" in localStorage)? localStorage.theme : themes[0]);
  const { t } = useTranslation();
  const { appiconUrl, logoUrl } = config.env;

  useEffect(() => {
    if (theme.key === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.theme = theme.key;
    }
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <>
      {/* If using a mobile view: <div className="hidden lg:flex lg:flex-shrink-0"> */}
      <div className="flex h-full flex-shrink-0">
        <div
          className={cs(
            "flex w-[70px] flex-col border-r border-r-gray-100 transition-[width] duration-150 ease-in-out dark:border-r-zinc-800",
            {
              "w-64": !menuCollapsed,
            }
          )}
        >
          <div className="flex min-h-0 flex-1 flex-col bg-gray-50 dark:bg-p2dark-1000">
            <div className="flex-1">
              {menuCollapsed ? (
                <div
                  className="group flex items-center justify-center py-4 pt-8 hover:cursor-pointer "
                  onClick={() => setMenuCollapsed(!menuCollapsed)}
                >
                  {appiconUrl ? (
                    <img
                      src={appiconUrl}
                      className="h-full w-full max-w-[50px]"
                      alt="App Icon"
                    />
                  ) : (
                    <DoubleSlashBrandIcon />
                  )}
                  <ChevronIcon className="ml-[1px] stroke-gray-400 group-hover:stroke-gray-600" />
                </div>
              ) : (
                <div
                  className="group flex items-center justify-between py-4 pr-4 pl-8 pt-8 hover:cursor-pointer"
                  onClick={() => setMenuCollapsed(!menuCollapsed)}
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="App Icon"
                      className="w-auto max-w-[185px]"
                    />
                  ) : (
                    <FullBrandIcon />
                  )}
                  <ChevronIcon className="rotate-180 stroke-gray-400 group-hover:stroke-gray-600" />
                </div>
              )}
              <nav
                aria-label="Sidebar"
                className={cs(
                  "flex flex-col items-center space-y-3 py-6 font-semibold",
                  {
                    "px-4": !menuCollapsed,
                  }
                )}
              >
                {navigation.map((item) => {
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        cs(
                          "group flex items-center rounded-lg border-2 border-gray-200 p-[14px] text-sm transition-colors hover:border-gray-300 hover:bg-white dark:hover:border-zinc-600 dark:hover:bg-p2dark-900",
                          {
                            "dark:border-zinc-600 dark:text-white": !isActive,
                            "group:text-p2blue-700 border-p2blue-700 bg-white text-p2blue-700 dark:bg-p2dark-900":
                              isActive,
                            "w-full border-0": !menuCollapsed,
                            "border-p2blue-700 text-p2blue-700 hover:border-p2blue-700 dark:hover:border-p2blue-700 dark:hover:bg-p2dark-900":
                              menuCollapsed && isActive,
                          }
                        )
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{t(item.name)}</span>
                      {!menuCollapsed && (
                        <span className="pl-2">{t(item.name)}</span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
            <div
              className={cs("p-5", {
                "flex flex-shrink-0 justify-center": menuCollapsed,
                "": !menuCollapsed,
              })}
            >
              <Popover className="relative">
                <Popover.Button className="outline-none">
                  <div className="flex items-center">
                    <div className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-semibold dark:bg-zinc-400">
                      <Gravatar email={user?.email} className="rounded-full" />
                    </div>
                    {!menuCollapsed && (
                      <p className="ml-2 text-sm font-semibold dark:text-white">
                        {fullName()}
                      </p>
                    )}
                  </div>
                </Popover.Button>
                <Popover.Panel className="absolute bottom-10 left-0 z-[100] w-72 divide-y rounded-lg border bg-white px-5 shadow-lg dark:divide-zinc-700 dark:border-zinc-700 dark:bg-p2dark-900">
                  <div className="py-5">
                    <div className="font-semibold dark:text-gray-200">
                      {fullName()}
                    </div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/"
                      className="group -mx-3 flex items-center justify-between rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-zinc-800 dark:hover:text-gray-100"
                    >
                      <div>{t("returnToHomepage")}</div>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="relative flex items-center justify-between py-2">
                    <div className="text-sm dark:text-zinc-200">
                      {t("theme")}
                    </div>
                    <Listbox value={theme} onChange={setTheme}>
                      <Listbox.Button className="flex items-center space-x-2 rounded border px-2 py-1 text-sm hover:border-gray-500 dark:border-zinc-600 dark:text-zinc-200 dark:hover:border-zinc-400">
                        <div>{theme.icon}</div>
                        <div>{t(theme.name)}</div>
                      </Listbox.Button>
                      <Listbox.Options className="absolute bottom-0 right-0 rounded border bg-white shadow-md dark:border-zinc-600 dark:bg-p2dark-900">
                        {themes.map((item) => (
                          <Listbox.Option
                            key={item.key}
                            value={item}
                            className="flex cursor-pointer items-center space-x-2 px-2 py-1 text-sm hover:bg-gray-100 dark:text-zinc-200 dark:hover:bg-zinc-600"
                          >
                            <div>{item.icon}</div>
                            <div>{t(item.name)}</div>
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Listbox>
                  </div>
                  <div className="py-5">
                    <Button
                      className="w-full"
                      onClick={() => keycloakService.logout()}
                    >
                      {t("logOut")}
                    </Button>
                  </div>
                </Popover.Panel>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesktopSidebarNav;
