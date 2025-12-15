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

            <div className="container profile">
                {/* MAIN PROFILE CARD */}
                <div className="profile-card">

                    {/* IDENTITY */}
                    <div className="profile-section profile-identity">
                        <img
                            src={user.avatar || "/avatar-placeholder.png"}
                            className="profile-avatar"
                            alt="avatar"
                        />

                        <div className="profile-user">
                            <div className="profile-name">{user.username}</div>
                            <div className="profile-email">{user.email}</div>
                        </div>

                        <div className="profile-role">
                            user
                        </div>
                    </div>

                    {/* STATS + ACTIVITY */}
                    <div className="profile-section profile-grid">
                        <div>
                            <h3>Statistics</h3>
                            <ul className="profile-stats">
                                <li><span>Posts</span><strong>0</strong></li>
                                <li><span>Comments</span><strong>0</strong></li>
                                <li><span>Reputation</span><strong>0</strong></li>
                            </ul>
                        </div>

                        <div>
                            <h3>Activity</h3>
                            <p className="muted">No recent activity</p>
                        </div>
                    </div>

                    {/* RECENT CONTENT */}
                    <div className="profile-section">
                        <h3>Recent content</h3>
                        <p className="muted">Coming soon</p>
                    </div>

                </div>
            </div>
        </>
    );
}
