import React from 'react';
import withRouter from 'umi/withRouter';
import { TabBar, Popover, Icon } from 'antd-mobile';
import router from 'umi/router';
import Authorized from '@/utils/Authorized';
import Exception403 from '@/pages/exception/403';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import theme from '../theme';
import styles from './TabBarLayout.less';

class TabBarLayout extends React.PureComponent {
    state = {
        visible: true,
        selected: '',
    };

    /**
     * 获取路由访问权限
     * @param pathname
     * @param routeData
     * @returns {string[]}
     */
    getRouterAuthority = (pathname, routeData) => {
        let routeAuthority = ['noAuthority'];
        const getAuthority = (key, routes) => {
            routes.map(route => {
                if (route.path && pathToRegexp(route.path).test(key)) {
                    routeAuthority = route.authority;
                } else if (route.routes) {
                    routeAuthority = getAuthority(key, route.routes);
                }
                return route;
            });
            return routeAuthority;
        };
        return getAuthority(pathname, routeData);
    };

    /**
     * 获取 路由配置中带有 NAME 属性的路由信息
     * @param routes
     */
    getTabBarItems = (routes) => {
        if (routes && typeof routes === 'object') {
            return (routes || []).filter(item => item.title !== undefined);
        }
        return [];
    };


    /**
     * 渲染组建
     * @param children
     * @param pathname
     * @param routes
     * @param iconDir
     * @returns {*}
     */
    getChildrenContent = (children, pathname, routes, iconDir) => {
        const { visible } = this.state;
        const tabBarItems = this.getTabBarItems(routes);
        const routerConfig = this.getRouterAuthority(pathname, routes);
        let tabBarItem = [];
        if (tabBarItems && tabBarItems.length > 0) {
            if (tabBarItems.length > 5) {
                const items = [];
                const moreItems = [];
                tabBarItems.map((item, index) => {
                    if (index < 4) {
                        items.push({
                            ...item,
                        });
                    } else {
                        moreItems.push({
                            ...item,
                        });
                    }
                    return '';
                });

                tabBarItem = items.map((item) => (
                    <TabBar.Item
                        // style={{maxHeight:document.documentElement.clientHeight - 100}}
                        title={item.title}
                        key={`tab-bar-item-${item.path}`}

                        icon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: `url(${require(`@/assets/tarbar/${iconDir}/${item.iconName || item.title}-un.svg`)}) center center /  21px 21px no-repeat`,
                        }}
                        />
                        }
                        selectedIcon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: `url(${require(`@/assets/tarbar/${iconDir}/${item.iconName || item.title}.svg`)}) center center /  21px 21px no-repeat`,
                        }}
                        />
                        }
                        selected={pathname.startsWith(item.path)}
                        badge={0}
                        onPress={() => {
                            router.push(item.path);
                        }}
                        data-seed="logId"
                    >
                        <Authorized authority={routerConfig} noMatch={<Exception403/>}>
                            {children}
                        </Authorized>
                    </TabBar.Item>));
                const popoverItem = moreItems.map((item) => (
                    <Popover.Item
                        // style={{maxHeight:document.documentElement.clientHeight - 100}}
                        key={`popover-item-${item.path}`}
                        value={item.title}
                        icon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: `url(${require(`@/assets/tarbar/${iconDir}/${item.iconName || item.title}-un.svg`)}) center center /  21px 21px no-repeat`,
                        }}
                        />}
                    >{item.name}
                    </Popover.Item>));


                tabBarItem.push(
                    <TabBar.Item
                        // style={{maxHeight:document.documentElement.clientHeight - 100}}
                        title='更多'
                        key="tab-bar-item-more"
                        icon={<Icon style={{ width: '22px', height: '22px' }} type='ellipsis'/>}
                        selectedIcon={<div style={{ width: '22px', height: '22px', color: theme.primaryColor }} type='ellipsis'/>}
                        selected={pathname === 'more'}
                        badge={0}
                        onPress={() => {
                            this.handleVisibleChange({ visible: true });
                        }}
                    >
                        <Popover
                            mask
                            visible={visible}
                            overlay={popoverItem}
                            placement='bottomRight'
                            align={{
                                overflow: { adjustY: 0, adjustX: 0 },
                                offset: [-10, 0],
                            }}
                            onVisibleChange={this.handleVisibleChange}
                            onSelect={this.onSelect}
                        >
                            <div style={{
                                height: '100%',
                                padding: '0 15px',
                                marginRight: '-15px',
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                            }}
                            >
                                <Icon type="ellipsis"/>
                            </div>
                        </Popover>
                    </TabBar.Item>,
                );
            } else {
                tabBarItem = tabBarItems.map((item) => {
                    return(
                        <TabBar.Item
                            // style={{maxHeight:document.documentElement.clientHeight - 100}}
                            title={item.title}
                            key={`tab-bar-item-${item.path}`}

                            icon={<div style={{
                                width: '22px',
                                height: '22px',
                                background: `url(${require(`@/assets/tarbar/${iconDir}/${item.iconName || item.title}-un.svg`)}) center center /  21px 21px no-repeat`,
                            }}
                            />
                            }
                            selectedIcon={<div style={{
                                width: '22px',
                                height: '22px',
                                background: `url(${require(`@/assets/tarbar/${iconDir}/${item.iconName || item.title}.svg`)}) center center /  21px 21px no-repeat`,
                            }}
                            />
                            }
                            selected={pathname.startsWith(item.path)}
                            badge={0}
                            onPress={() => {
                                router.push(item.path);
                            }}
                            data-seed="logId"
                        >
                            <Authorized authority={routerConfig} noMatch={<Exception403/>}>
                                {children}
                            </Authorized>
                        </TabBar.Item>)});
            }


            return (
                <div style={{ position: 'fixed', height: '100%', maxWidth: '540px',width:'100%', top: 0, margin:'0 auto' }}>
                    <TabBar
                        prerenderingSiblingsNumber={0}
                        unselectedTintColor="#949494"
                        tintColor="#33A3F4"
                        barTintColor="white"
                        tabBarPosition='bottom'
                    >
                        {tabBarItem}
                    </TabBar>
                </div>
            );
        }
        router.push('/404');
        return (<></>);

    };

    handleVisibleChange = (visible) => {
        this.setState({
            visible,
        });
    };

    onSelect = (opt) => {
        console.log(opt.props.value);
        this.setState({
            visible: false,
            selected: opt.props.value,
        });
    };

    render() {
        const {
            children,
            location: { pathname },
            route: { routes, iconDir },
        } = this.props;

        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    {this.getChildrenContent(children, pathname, routes, iconDir)}
                </div>
            </div>
        );
    }
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(TabBarLayout));
