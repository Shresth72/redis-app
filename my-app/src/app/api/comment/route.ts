import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { redis } from "@/lib/redis";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { text, tags } = body;

    const commentId = nanoid();

    //retrieve and store comment details
    const comment = {
      text,
      timestamp: new Date(),
      author: req.cookies.get("userId")?.value,
    };

    //Optimization
    await Promise.all([
      //add comment to list
      redis.rpush("comments", commentId),

      //add tags to comments
      redis.sadd(`tags:${commentId}`, tags),

      redis.hset(`comment_details:${commentId}`, comment),
    ]);

    console.log(comment);

    return new Response("OK");
  } catch (error) {
    console.log(error);
  }
};
