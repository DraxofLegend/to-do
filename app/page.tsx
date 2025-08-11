'use client';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect } from "react";
import { useState, } from "react";
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion";


interface TaskForm {
  title: string;
}

interface Task {
  title: string;
  id: number;
}

export default function Home() {

  const { register, handleSubmit, reset } = useForm<TaskForm>()
  const [tasks, setTasks] = useState<Task[]>([])
  const [checked, isChecked] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    const fetchTasks = async () => {

      const res = await axios.get('/api/task');
      setTasks(res.data);

      const initialChecked: { [key: number]: boolean } = {};
      res.data.forEach((task: Task) => {
        initialChecked[task.id] = false;
      });
      isChecked(initialChecked);
    };


    fetchTasks();
  }, []);


  return (
    <div className="p-5 space-y-4 min-h-screen">
      <h1 className="text-center text-3xl">To-Do App</h1>
      <form className="flex gap-4 justify-center" onSubmit={handleSubmit(async (data) => {
        await axios.post('/api/task', data)
        await axios.get('/api/task')
          .then((res) => {
            setTasks(res.data)
            reset()
          })
          .catch((err) => {
            console.error("Failed to fetch tasks", err)
          })

      })}>
        <Input {...register("title")} type="text" className="max-w-[70%]" placeholder="Enter Task Here" />
        <Button type="submit" className="cursor-pointer" variant="outline">Submit</Button>
      </form>
      <div className="bg-gray-600/40 min-h-130 px-4 py-4">
        {[...tasks].reverse().map((task) => (
          <motion.div key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center">
            <Checkbox
              className="w-6 h-6 cursor-pointer border-black"
              checked={checked[task.id] || false}
              onCheckedChange={(checked) =>
                isChecked((prev) => ({
                  ...prev,
                  [task.id]: checked as boolean,
                }))
              }
            />
            <div
              className={`flex text-xl ${checked[task.id] ? 'text-white bg-black' : 'text-black bg-white'
                } border-2 border-black p-5 items-center justify-center ml-3 rounded-3xl w-xl my-3`}
            >

              {task.title}

            </div>
            <img src="/bin.png" className="w-6 m-3 cursor-pointer" onClick={async () => {
              await axios.delete('/api/task', { data: { id: task.id } })

              const res = await axios.get('/api/task');
              setTasks(res.data);
            }}></img>
          </motion.div>))}
      </div>
    </div>
  );
}
