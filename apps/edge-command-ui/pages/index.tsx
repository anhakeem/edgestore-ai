import Head from 'next/head';
import { loadEdgeCommand, EdgeTask } from '../lib/loadCommand';
import TaskCard from '../components/TaskCard';

export default function Home({ tasks }: { tasks: EdgeTask[] }) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Head>
        <title>EdgeCommand Control Panel</title>
      </Head>
      <h1 className="text-3xl font-bold mb-6">🧠 EdgeCommand Control Panel</h1>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const tasks = loadEdgeCommand();
  return {
    props: {
      tasks,
    },
  };
}
