import { io, Socket } from "socket.io-client";
import { HomeUserData } from "@/redux/userData";

const URL = process.env.NEXT_PUBLIC_SOCKET_URL as string;

export function createSocket(
  userData: HomeUserData,
  homeAccessToken: string | null,
  homeUserId: string | null
): Socket {
  const s: Socket = io(URL, {
    extraHeaders: {
      userData: JSON.stringify(userData ?? {}),
      token: `Bearer ${homeAccessToken ?? ""}`,
      userid: homeUserId ?? "",
    },
    autoConnect: false,
    secure: true,
  });

  return s;
}
