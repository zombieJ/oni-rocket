import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import 'antd/dist/antd.css';
import styles from './index.less';

const { Header, Content, Footer } = Layout;

export default class Home extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">火箭</Menu.Item>
          </Menu>
        </Header>
        <Content>
          <div className={styles.content}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Template By <a href="https://ant.design/" target="_blank">Ant Design</a>
        </Footer>
      </Layout>
    );
  }
}