import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const cookie = document.cookie
            .split("; ")
            .find(row => row.startsWith("user="));

        if (!cookie) {
            router.push("/login");
            return;
        }

        try {
            setUser(JSON.parse(decodeURIComponent(cookie.split("=")[1])));
        } catch {
            router.push("/login");
        }
    }, []);

    if (!user) return null;

    return (
        <>
            <Head>
                <link rel="stylesheet" href="/css/profile_style.css" />
            </Head>

            <div className="profile-hero">
                {/* PROFILE CARD */}
                <div className="profile-card">
                    <img
                        src={user.avatar || "/avatar-placeholder.png"}
                        alt="avatar"
                    />

                    <h1>{user.username}</h1>
                    <p>{user.email}</p>

                    <div className="profile-stats">
                        <div>
                            <strong>0</strong>
                            <span>Posts</span>
                        </div>
                        <div>
                            <strong>0</strong>
                            <span>Comments</span>
                        </div>
                        <div>
                            <strong>0</strong>
                            <span>Reputation</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
