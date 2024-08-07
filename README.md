# Discord Clone Next.js 14
 - [中文](#中文) 
 - [English](#english) 
 - ## 中文
 - ### 前言
   该项目使用 Next.js 14 实现仿 Discord ，包括群组(Server)、频道、视频通话、群组消息、群组成员之间的发消息和好友功能。为了在 Next.js 框架中使用 Socket.io，我用了 Custom Server。虽然这种方法存在一些问题，但对我来说是可以接受的，因为我只是想尝试新的东西，而且不想使用另一个服务器进行实时消息传递。尽管如此，将 websocket 服务器和 Next.js 代码分开是比较理想和现实的。
  - ### 技术栈
    - **Next.js 14** 使用 React 新特性：Server Component,Server Action,Streaming...
    - **Clerk** 用于身份验证。
    - **Shadcn/UI** 和 **TailwindCSS** 用于 UI 和样式。
    - **Tanstack Query** 用于无限加载消息和即时更新消息。
    - **Prisma** 用于数据库 ORM。
    - **Uploadthing** 用于上传图像和文件（与 Node.js 运行环境不兼容）。
    - **LiveKit** 用于音频和视频通话。
  - ### 实体 - 关系图 (ERD)
    为了更好的了解项目，我画了一个 ERD 图
![image](https://github.com/toMo2syo/discord-clone-nextjs14/assets/107993863/692442b8-03e3-4b7f-a9d4-b24c95f90ed1)
  - ### 如何开始项目
  #### 步骤 1、添加 `.env` 文件
```
#Database Url
DATABASE_URL=

#Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=

#Uploadthing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

#Livekit
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
```
#### 步骤2、运行命令
```
# 安装依赖项
npm install
# 运行开发服务器
npm run dev
```
  - ### 部署
  到目前为止，将 Socket.io 与 Next.js 结合使用的唯一官方方法是使用 [Custom Server](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server)。但是，它们还不能很好地集成。我**不**建议使用这种方法。更好、更实用的方法是将 Socket 服务器与 Next.js 分开。因为这种方法会导致一些问题（至少在这个项目中）。我首先尝试在 Netlify 使用 Next.js 运行环境部署。除了 Socket.io 之外，包括 Uploadthing 在内的一切都运行正常。然后，我尝试使用 Node.js 运行环境部署，这次 Socket.io 成功运行，但 Uploadthing 却不能用。我猜 Uploadthing 需要 在Next.js 运行环境才能正常运行，而不是 Node.这很合理，毕竟我是在 Uploadthing 的 Next.js 部分跟着做的。无论如何，暂时不要尝试将Socket.io 与 Next.js 一起使用，将 Next.js 与 Socket.io 分开是比较好的选择。

#### 官方文档
- [Next.js Custom Server](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server)
- [Use socket.io with Next.js](https://socket.io/how-to/use-with-nextjs)


 - ## English 
 - ### Project Description 
   This project uses Next.js 14 to create a basic Discord clone, featuring servers, channels, video calls, group messaging, direct messaging within server members, and friends. I am using a custom server to integrate Socket.io with Next.js. Although this approach has some issues, it is acceptable for me as I want to try new things and avoid having another server for real-time messaging. Nevertheless, it is ideal and practical to have a separate server for websocket in the real world.

 - ### Tech Stack
   -   **Next.js 14** with React new features such as server components, server actions, streaming, and more.
   -   **Clerk** for authentication.
   -   **Shadcn/UI** and **TailwindCSS** for UI and styling.
   -   **Tanstack Query** for infinite loading messages and instant updates.
   -   **Prisma** for database ORM.
   -   **Uploadthing** for uploading images and files (not compatible with Node.js runtime).
   -   **LiveKit** for audio and video calls.
  - ### Entity-Relationship Diagram (ERD)
    I draw a ERD for you to better understand the project:
   ![image](https://github.com/toMo2syo/discord-clone-nextjs14/assets/107993863/692442b8-03e3-4b7f-a9d4-b24c95f90ed1)
  - ### Get stared
   #### Step 1.  add `.env` file
```
   #Database Url
   DATABASE_URL=
   
   #Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=
   
   #Uploadthing
   UPLOADTHING_SECRET=
   UPLOADTHING_APP_ID=
   
   #Livekit
   LIVEKIT_API_KEY=
   LIVEKIT_API_SECRET=
   NEXT_PUBLIC_LIVEKIT_URL=
```
  #### Step 2.  run the command
```
   # Install dependencies 
   npm install 
   # Run a development server 
   npm run dev
```
  - ### Deploy
     Up to now, the only official way to use Socket.io with Next.js is to use a [custom server](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server). However, they do not integrate well yet. I do **NOT** recommend using this approach. The better and more practical way is to separate your Socket server from Next.js. Beceuse this approach causes some problems (at least in this project). I first tried to deploy the app on Netlify with the Next.js runtime. Everything, including Uploadthing, worked fine except for Socket.io. Then, I tried to deploy it using the Node.js runtime; Socket.io worked this time, but Uploadthing did not, which might make sense because I used Uploadthing with the Next.js runtime, not Node.js. It's kind of weird. Anyway, do not try to integrate Socket.io with Next.js for now; separate your Next.js app from Socket.io.
   
    #### Official docs
    - [Next.js Custom Server](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server)
    - [Use socket.io with Next.js](https://socket.io/how-to/use-with-nextjs)
