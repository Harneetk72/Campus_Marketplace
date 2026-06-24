                import Chat from "../Model/chat.model.js";

                const setupSocket = (io) => {
                io.on("connection", (socket) => {
                    console.log("User Connected:", socket.id);

                    // Join Room
                    socket.on("join_room", (roomId) => {
                    socket.join(roomId);
                    console.log("Joined Room:", roomId);
                    });

                    // Send Message
                    socket.on("send_message", async (data) => {
                    try {
                        let chat = await Chat.findOne({
                        roomId: data.roomId,
                        });

                        const newMessage = {
                        roomId: data.roomId,
                        senderId: data.senderId,
                        receiverId: data.receiverId,
                        senderName: data.senderName,
                        message: data.message,
                        createdAt: new Date(),
                        };

                        if (!chat) {
                        chat = await Chat.create({
                            roomId: data.roomId,
                            messages: [newMessage],
                        });
                        } else {
                        chat.messages.push(newMessage);
                        await chat.save();
                        }

                        // Emit only once
                        io.to(data.roomId).emit(
                        "receive_message",
                        newMessage
                        );
                    } catch (error) {
                        console.log("Socket Error:", error);
                    }
                    });

                    socket.on("disconnect", () => {
                    console.log(
                        "User Disconnected:",
                        socket.id
                    );
                    });
                });
                };

                export default setupSocket;