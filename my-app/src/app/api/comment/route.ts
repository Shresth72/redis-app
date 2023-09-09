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

    return new Response("OK");
  } catch (error) {
    console.log(error);
  }
};
