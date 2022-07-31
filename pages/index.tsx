/*
 *
 * Home
 *
 */
import type { NextPage } from 'next';
import request from '@Utils/request';

interface Props {
  posts: any;
}

const Home: NextPage<Props> = ({ posts }) => {
  console.log(posts);
  return <h1>Hello from Home</h1>;
};

Home.getInitialProps = async () => {
  const res = await request.get('/users');
  return { posts: res.data };
};

export default Home;
