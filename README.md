# Discord Clone Next.js 14
 - [中文](#中文) 
 - [English](#english) 
 - ## 中文
 - ### 前言
   该项目使用Next.js 14实现仿Discord ，包括群组(Server)、频道、视频通话、群组消息、群组成员之间的发消息和好友功能。为了在Next.js框架中使用Socket.io，我用了Custom Server。虽然这种方法存在一些问题，但对我来说是可以接受的，因为我只是想尝试新的东西，而且不想使用另一个服务器进行实时消息传递。尽管如此，将websocket服务器和Next.js代码分开是比较理想和现实的。
  
   点击 [**这里**](https://discord-clone-nextjs14-production.up.railway.app) 预览项目(注，不能上传文件和图片，详情见[部署](#部署)部分)
  - ### 技术堆栈
    - **Next.js 14** 新功能：Server Component,Server Action,Streaming...
    - **Clerk** 用于身份验证。
    - **Shadcn/UI** 和 **TailwindCSS** 用于 UI 和样式。
    - **Tanstack Query** 用于无限加载消息和即时更新消息。
    - **Prisma** 用于数据库 ORM。
    - **Uploadthing** 用于上传图像和文件（与Node.js运行环境不兼容）。
    - **LiveKit** 用于音频和视频通话。
  - ### 实体 - 关系图 (ERD)
    为了更好的了解项目，我画了一个 EDR图
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
  到目前为止，将 Socket.io 与 Next.js 结合使用的唯一官方方法是使用 [Custom Server](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server)。但是，它们还不能很好地集成。我**不**建议使用这种方法。更好、更实用的方法是将 Socket 服务器与 Next.js 分开。因为这种方法会导致一些问题（至少在这个项目中）。我首先尝试在Netlify使用 Next.js运行环境部署。除了 Socket.io 之外，包括 Uploadthing 在内的一切都运行正常。然后，我尝试使用 Node.js运行环境部署，这次 Socket.io 成功运行，但 Uploadthing 却不能用。我猜Uploadthing需要在Next.js运行环境才能正常运行，而不是 Node.这很合理，毕竟我是在Uploadthing的Next.js部分跟着做的。无论如何，暂时不要尝试将Socket.io与Next.js一起使用，将Next.js与 Socket.io 分开是比较好的选择。

#### 官方文档
- [Next.js Custom Server](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server)
- [Use socket.io with Next.js](https://socket.io/how-to/use-with-nextjs)


 - ## English 
 - ### Project Description 
   This project uses Next.js 14 to create a basic Discord clone, featuring servers, channels, video calls, group messaging, direct messaging within server members, and friends. I am using a custom server to integrate Socket.io with Next.js. Although this approach has some issues, it is acceptable for me as I want to try new things and avoid having another server for real-time messaging. Nevertheless, it is ideal and practical to have a separate server for websocket in the real world.
   
   Click [**Live Demo**](https://discord-clone-nextjs14-production.up.railway.app) to preview the project.(Uploading image and file does not working in production as I explaine in [deploy](#deploy) section)
 - ### Tech Stack
   -   **Next.js 14** with new features such as server components, server actions, streaming, and more.
   -   **Clerk** for authentication.
   -   **Shadcn/UI** and **TailwindCSS** for UI and styling.
   -   **Tanstack Query** for infinite loading messages and instant updates.
   -   **Prisma** for database ORM.
   -   **Uploadthing** for uploading images and files (not compatible with Node.js runtime).
   -   **LiveKit** for audio and video calls.
  - ### Entity-Relationship Diagram (ERD)
    I draw a EDR for you to better understand the project:
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
