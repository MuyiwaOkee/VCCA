"use client"

import {
  autoUpdate,
  FloatingFocusManager,
  offset,
  useClick,
  useFloating,
  useInteractions,
  useDismiss,
} from '@floating-ui/react';
import {
  VisaAccountLow,
  VisaChevronDownTiny,
  VisaChevronUpTiny,
  VisaCloseLow,
  VisaCloseTiny,
  VisaMenuLow,
  VisaNotificationsLow,
  VisaSearchLow,
} from '@visa/nova-icons-react';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  DropdownButton,
  DropdownMenu,
  Input,
  InputContainer,
  Link as NovaLink,
  Listbox,
  ListboxItem,
  Nav,
  NavAppName,
  Surface,
  Tab,
  TabSuffix,
  Tabs,
  Typography,
  Utility,
  UtilityFragment,
  VisaLogo,
} from '@visa/nova-react';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NotificationTray, { NotificationItemProps } from './NotificationTray';

// TIP: Customize this ID, pass it as a prop, or auto-generate it with useId() from @react
const id = 'active-element-horizontal-nav';

const accountSubItems = [
  {
    tabLabel: 'Logout',
    id: `${id}-account-sub-item-0`,
    href: '/logout',
  }
];

const label3SubItems = [
  {
    tabLabel: 'L2 label 1',
    id: `${id}-label-3-sub-item-0`,
    href: './horizontal-navigation',
  },
  {
    tabLabel: 'L2 label 2',
    id: `${id}-label-3-sub-item-1`,
    href: './horizontal-navigation',
  },
];

export const Navbar = () => {
    const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement | null>(null!);
  const searchButtonRef = useRef<HTMLButtonElement | null>(null!);

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileAccountMenuOpen, setMobileAccountMenuOpen] = useState(false);
  const [mobileLabel3MenuOpen, setMobileLabel3MenuOpen] = useState(false);
  const [expandSearch, setExpandSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const [label3Open, setLabel3Open] = useState(false);
  const [notificationTrayOpen, setNotificationTrayOpen] = useState(false)
  const searchInitiallyActivated = useRef(false);

  const seenNotifications: NotificationItemProps[] = [
      {
          id: 'notif-001',
          title: 'System Update Completed',
          message: 'Your system update was successfully installed.',
          timestamp: new Date('2025-06-19T10:00:00Z'),
          link: {
              href: '/updates/logs',
              text: 'View logs'
          },
          seen: true
      },
      {
          id: 'notif-002',
          title: 'Weekly Backup',
          message: 'Your weekly backup completed without errors.',
          timestamp: new Date('2025-06-18T14:30:00Z'),
          seen: true
      }
  ];
  
  const unseenNotifications: NotificationItemProps[] = [
      {
          id: 'notif-003',
          title: 'Security Alert',
          message: 'Unusual login detected from a new device.',
          timestamp: new Date('2025-06-20T08:15:00Z'),
          urgency: 'Warning',
          link: {
              href: '/security/settings',
              text: 'Review activity'
          },
          seen: false,
      },
      {
          id: 'notif-004',
          title: 'Critical System Error',
          message: 'A critical error occurred in the application.',
          timestamp: new Date('2025-06-20T09:00:00Z'),
          urgency: 'Error',
          seen: false
      }
  ];

  useEffect(() => {
    if (expandSearch && searchInitiallyActivated.current) {
      searchInputRef.current?.focus();
    }
    if (!expandSearch && searchInitiallyActivated.current) {
      searchButtonRef.current?.focus();
    }
  }, [expandSearch]);

  // For dropdown menus in the horizontal nav, we use floating UI for
  // -opening
  // -positioning
  // -dismissing

  // floating-ui setup for the account dropdown
  const {
    context: accountFloatingContext,
    floatingStyles: accountFloatingStyles,
    refs: accountFloatingRefs,
  } = useFloating({
    middleware: [offset(2)],
    open: accountMenuOpen,
    onOpenChange: setAccountMenuOpen,
    placement: 'bottom-end',
    whileElementsMounted: autoUpdate,
  });
  const clickAccountRef = useClick(accountFloatingContext);
  const dismissAccountMenu = useDismiss(accountFloatingContext);
  const { getReferenceProps: getAccountReferenceProps, getFloatingProps: getAccountFloatingProps } = useInteractions([
    clickAccountRef,
    dismissAccountMenu,
  ]);

  // floating-ui setup for the notification tray tab dropdown
  const {
    context: label3FloatingContext,
    floatingStyles: label3FloatingStyles,
    refs: label3FloatingRefs,
  } = useFloating({
    middleware: [offset(2)],
    open: notificationTrayOpen,
    onOpenChange: setNotificationTrayOpen,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
  });
  const clickLabel3Ref = useClick(label3FloatingContext);
  const dismissLabel3Menu = useDismiss(label3FloatingContext);
  const { getReferenceProps: getLabel3ReferenceProps, getFloatingProps: getLabel3FloatingProps } = useInteractions([
    clickLabel3Ref,
    dismissLabel3Menu,
  ]);

  const onToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div>
      <NovaLink skipLink href="#content">
        Skip to content
      </NovaLink>
      <UtilityFragment vJustifyContent="between">
        <Nav id={id} orientation="horizontal" tag="header">
          {!expandSearch ? (
            <>
              <UtilityFragment vContainerHide="desktop">
                <DropdownButton
                  aria-controls={`${id}-mobile-menu`}
                  aria-expanded={mobileMenuOpen ? 'true' : 'false'}
                  aria-describedby={`${id}-mobile-menu-notifications-badge`}
                  aria-label="open menu"
                  buttonSize="large"
                  colorScheme="tertiary"
                  iconButton
                  id={`${id}-mobile-menu-button`}
                  onClick={onToggleMobileMenu}
                >
                  {mobileMenuOpen ? (
                    <VisaCloseTiny />
                  ) : (
                    <>
                      <VisaMenuLow />
                      <Badge
                        id={`${id}-mobile-menu-notifications-badge`}
                        aria-label="3 notifications"
                        badgeVariant="number"
                        tag="sup"
                      >
                        3
                      </Badge>
                    </>
                  )}
                </DropdownButton>
              </UtilityFragment>
              <UtilityFragment vFlex vGap={16}>
                <NovaLink
                  aria-label="Visa Credit Card Analysis"
                  href="/"
                  id={`${id}-home-link`}
                  noUnderline
                  style={{ backgroundColor: 'transparent' }}
                >
                  <VisaLogo />
                  <NavAppName>
                    <Utility
                      vContainerHide="xs"
                      element={<Typography variant="headline-3">Visa Credit Card Analysis</Typography>}
                    />
                  </NavAppName>
                </NovaLink>
              </UtilityFragment>
              <UtilityFragment vFlex vJustifyContent="end" vFlexGrow vMarginLeft="auto" vContainerHide="mobile">
                <nav aria-label="Label for horizontal example with active element">
                  <UtilityFragment vGap={4}>
                    <Tabs>
                      <Tab>
                        <Button
                          aria-current={pathname === '/dashboard' ? "page" : false}
                          buttonSize="large"
                          colorScheme="tertiary"
                          element={<Link href="/dashboard">Dashboard</Link>}
                        />
                      </Tab>
                      <Tab>
                        <Button
                        aria-current={pathname === '/predict' ? "page" : false}
                          buttonSize="large"
                          colorScheme="tertiary"
                          element={<Link href="/predict">Predict</Link>}
                        />
                      </Tab>
                      {/* <Tab>
                        <DropdownButton
                          aria-expanded={label3Open}
                          aria-controls={label3Open ? `${id}-label-dropdown-menu` : undefined}
                          id={`${id}-label-dropdown-button`}
                          buttonSize="large"
                          colorScheme="tertiary"
                          ref={label3FloatingRefs.setReference}
                          {...getLabel3ReferenceProps()}
                        >
                          L1 label 3<TabSuffix element={label3Open ? <VisaChevronUpTiny /> : <VisaChevronDownTiny />} />
                        </DropdownButton>
                        {label3Open && (
                          <FloatingFocusManager
                            context={label3FloatingContext}
                            modal={false}
                            initialFocus={-1}
                            restoreFocus={true}
                          >
                            <DropdownMenu
                              id={`${id}-label-dropdown-menu`}
                              aria-hidden={!label3Open}
                              style={
                                {
                                  inlineSize: '180px',
                                  position: 'absolute',
                                  ...label3FloatingStyles,
                                  zIndex: 1,
                                } as CSSProperties
                              }
                              ref={label3FloatingRefs.setFloating}
                              {...getLabel3FloatingProps()}
                            >
                              <Listbox>
                                {label3SubItems.map(label3SubItem => (
                                  <li key={label3SubItem.id}>
                                    <UtilityFragment vPaddingVertical={4} vPaddingHorizontal={8}>
                                      <ListboxItem href={label3SubItem.href} tag="a">
                                        {label3SubItem.tabLabel}
                                      </ListboxItem>
                                    </UtilityFragment>
                                  </li>
                                ))}
                              </Listbox>
                            </DropdownMenu>
                          </FloatingFocusManager>
                        )}
                      </Tab> */}
                    </Tabs>
                  </UtilityFragment>
                </nav>
              </UtilityFragment>
              <Utility vFlex vGap={8} vMarginLeft={8}>
                <UtilityFragment vContainerHide="mobile">
                  <>
                    <DropdownButton
                          aria-expanded={notificationTrayOpen}
                          aria-controls={notificationTrayOpen ? `${id}-label-dropdown-menu` : undefined}
                          id={`${id}-label-dropdown-button`}
                          buttonSize="large"
                          colorScheme="tertiary"
                          ref={label3FloatingRefs.setReference}
                          iconButton
                          {...getLabel3ReferenceProps()}
                        >
                          <VisaNotificationsLow />
                    <Badge id={`${id}-notifications-badge`} badgeVariant="number" tag="sup">
                      3
                    </Badge>
                        </DropdownButton>
                        {notificationTrayOpen && (
                          <FloatingFocusManager
                            context={label3FloatingContext}
                            modal={false}
                            initialFocus={-1}
                            restoreFocus={true}
                          >
                            <div className='absolute top-24 right-8'>
                              <NotificationTray seenNotifications={seenNotifications} unseenNotifications={unseenNotifications}/>
                            </div>
                          </FloatingFocusManager>
                        )}
                  </>
                  
                </UtilityFragment>
                <UtilityFragment vContainerHide="mobile">
                  <Tab tag="div">
                    <DropdownButton
                      aria-expanded={accountMenuOpen}
                      aria-controls={accountMenuOpen ? `${id}-account-menu` : undefined}
                      aria-label="Alex Miller"
                      buttonSize="large"
                      colorScheme="tertiary"
                      element={<Avatar tag="button" />}
                      ref={accountFloatingRefs.setReference}
                      {...getAccountReferenceProps()}
                    >
                      <VisaAccountLow />
                      <TabSuffix element={accountMenuOpen ? <VisaChevronUpTiny /> : <VisaChevronDownTiny />} />
                    </DropdownButton>
                    {accountMenuOpen && (
                      <FloatingFocusManager
                        context={accountFloatingContext}
                        modal={false}
                        initialFocus={-1}
                        restoreFocus={true}
                      >
                        <DropdownMenu
                          id={`${id}-account-menu`}
                          aria-hidden={!accountMenuOpen}
                          style={
                            {
                              inlineSize: '180px',
                              position: 'absolute',
                              ...accountFloatingStyles,
                              zIndex: 1,
                            } as CSSProperties
                          }
                          ref={accountFloatingRefs.setFloating}
                          {...getAccountFloatingProps()}
                        >
                          <Listbox>
                            {accountSubItems.map(accountSubItem => (
                              <UtilityFragment key={accountSubItem.id}>
                                <Link href={accountSubItem.href}>
                                  <UtilityFragment vPaddingVertical={4} vPaddingHorizontal={8}> 
                                    <ListboxItem>
                                      {accountSubItem.tabLabel}
                                    </ListboxItem>
                                  </UtilityFragment>
                                </Link>
                              </UtilityFragment>
                            ))}
                          </Listbox>
                        </DropdownMenu>
                      </FloatingFocusManager>
                    )}
                  </Tab>
                </UtilityFragment>
              </Utility>
            </>
          ) : (
            <UtilityFragment vFlex>
              <Surface
                style={
                  {
                    '--v-surface-background': 'var(--palette-default-surface-3)',
                    '--v-surface-border-radius': 'var(--size-rounded-medium)',
                    '--v-surface-padding-inline': 'var(--size-scalable-8)',
                  } as CSSProperties
                }
              >
                <InputContainer>
                  <VisaSearchLow />
                  <Input
                    id={`${id}-search-field`}
                    name={`${id}-search-field`}
                    ref={searchInputRef}
                    required
                    type="search"
                    aria-label="Search"
                    placeholder="Search"
                  />
                </InputContainer>
                <Button
                  aria-label="close search"
                  buttonSize="large"
                  colorScheme="tertiary"
                  iconButton
                  onClick={() => setExpandSearch(false)}
                >
                  <VisaCloseLow />
                </Button>
              </Surface>
            </UtilityFragment>
          )}
        </Nav>
      </UtilityFragment>
      <UtilityFragment vContainerHide="desktop" vHide={!mobileMenuOpen}>
        <Nav
          aria-label="Label for horizontal example with active element"
          aria-hidden={!mobileMenuOpen}
          id={`${id}-mobile-menu`}
          orientation="vertical"
        >
          <Tabs orientation="vertical">
            <Tab>
              <Button
                buttonSize="large"
                colorScheme="tertiary"
                element={<a href="./horizontal-navigation">L1 label 1</a>}
              />
            </Tab>
            <Tab>
              <Button
                buttonSize="large"
                colorScheme="tertiary"
                element={<a href="./horizontal-navigation">L1 label 2</a>}
              />
            </Tab>

            <Tab tag="div">
              <Button
                aria-expanded={mobileLabel3MenuOpen}
                aria-controls={mobileLabel3MenuOpen ? `${id}-account-sub-menu` : 'undefined'}
                id={`${id}-mobile-menu-label-dropdown-button`}
                buttonSize="large"
                colorScheme="tertiary"
                onClick={() => setMobileLabel3MenuOpen(!mobileLabel3MenuOpen)}
              >
                L1 Label 3
                <TabSuffix element={mobileLabel3MenuOpen ? <VisaChevronUpTiny /> : <VisaChevronDownTiny />} />
              </Button>

              {mobileLabel3MenuOpen && (
                <Tabs orientation="vertical" id={`${id}-account-sub-menu`}>
                  {label3SubItems.map(label3SubItem => (
                    <Tab key={label3SubItem.id} id={label3SubItem.id}>
                      <Button
                        colorScheme="tertiary"
                        element={<a href={label3SubItem.href}>{label3SubItem.tabLabel}</a>}
                      />
                    </Tab>
                  ))}
                </Tabs>
              )}
            </Tab>
            <Tab>
              <Button
                buttonSize="large"
                colorScheme="tertiary"
                style={{ wordBreak: 'break-word', blockSize: 'max-content' } as CSSProperties}
              >
                Notifications
                <Badge badgeVariant="number" style={{ position: 'relative' }} tag="sup">
                  3
                </Badge>
              </Button>
            </Tab>
            <Divider dividerType="decorative"></Divider>
            <Tab tag="div">
              <Button
                aria-expanded={mobileAccountMenuOpen}
                aria-controls={`${id}-account-sub-menu`}
                aria-label="Alex Miller"
                buttonSize="large"
                colorScheme="tertiary"
                onClick={() => setMobileAccountMenuOpen(!mobileAccountMenuOpen)}
              >
                <VisaAccountLow />
                Alex Miller
                <TabSuffix element={mobileAccountMenuOpen ? <VisaChevronUpTiny /> : <VisaChevronDownTiny />} />
              </Button>
              {mobileAccountMenuOpen && (
                <Tabs orientation="vertical" id={`${id}-account-sub-menu`}>
                  {accountSubItems.map(accountSubItem => (
                    <Tab key={accountSubItem.id} id={accountSubItem.id}>
                      <Button
                        colorScheme="tertiary"
                        element={<a href={accountSubItem.href}>{accountSubItem.tabLabel}</a>}
                      />
                    </Tab>
                  ))}
                </Tabs>
              )}
            </Tab>
          </Tabs>
        </Nav>
      </UtilityFragment>
    </div>
  );
};