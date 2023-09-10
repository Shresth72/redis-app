import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { redis } from "@/lib/redis";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { text, tags } = body;

    const commentId = nanoid();

    //add comment to list
    await redis.rpush("comments", commentId);

    //add tags to comments
    await redis.sadd(`tags:${commentId}`, tags);

    // //retrieve and store comment details
    const comment = {
      text,
      timestamp: new Date(),
      author: req.cookies.get("userId")?.value,
    };

    console.log(comment);

    // await redis.hset(`comment_details:${commentId}`, comment);

    return new Response("OK");
  } catch (error) {
    console.log(error);
  }
};
