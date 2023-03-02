import type { InferGetServerSidePropsType } from "next";
import { Button } from "ui";
import { prisma } from "../lib/prisma";

export default function Web(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <h1>Web</h1>
      <Button />
      <div>
        {props.userPosts.map(({id, name, email, posts})=>{
          return (
            <div key={id}>
              <div>{name}({email})</div>
              <ol>{posts.map(({id, title, content})=>{
                return (
                  <li key={id}>
                    <div>{title}</div>
                    <div>{content}</div>
                  </li>
                )
              })}</ol>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export async function getServerSideProps(){
  const userPosts = await prisma.user.findMany({
    select: { 
      id: true,
      name: true,
      email: true,
      posts: {
        select: {
          id: true,
          title: true,
          content: true,
        }
      }
    },
    where: {
      posts: {
        every: {
          published: true,
        }
      }
    },
  })

  return {
    props: {
      userPosts,
    }
  }
}