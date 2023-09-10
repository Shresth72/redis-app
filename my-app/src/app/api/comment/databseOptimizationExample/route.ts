import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { redis2 } from "@/lib/redis2";

// REDIS JSON (only for upstash redis)
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { text, tags } = body;

    const commentId = nanoid();

    //retrieve and store comment details
    const comment = {
      text,
      tags: {
        Tyepscript: true,
      },
      upvotes: 0,
      timestamp: new Date(),
      author: req.cookies.get("userId")?.value,
    };

    //increment a number directly without reseting the json (hardcoded)
    await redis2.json.numincrby("comment:id", "$.upvotes", 1);

    //Database Optimization (Works only with upstash redis)
    //inserting the cache is form of a json
    await Promise.all([
      redis2.rpush("comments", commentId),

      redis2.json.set(`comment:${commentId}`, "$", comment), //$ is root

      //we can call the api $ to directly edit the json
      //redis2.json.set("key", "$.tags", { Typescript: false }),
    ]);

    console.log(comment);

    return new Response("OK");
  } catch (error) {
    console.log(error);
  }
};
