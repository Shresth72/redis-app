"use client"

import axios from "axios";
import Link from "next/link";

const Home = ({}) => {
  const comment = async () => {
    const { data } = await axios.post("/api/comment", {
      text: "hello",
      tags: ["Typescript"],
    });

    console.log(data);
  };

  return (
    <div className="flex flex-col gap-8 items-start">
      <Link href="/comments" prefetch={false}>
        See Comments
      </Link>
      <button onClick={comment}>Make Comment</button>
    </div>
  );
};

export default Home;
