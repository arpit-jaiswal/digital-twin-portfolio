import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Journey from "@/components/Journey";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Chat from "@/components/Chat";
import { profile, projects } from "@/data/profile";

export default function Home() {
  return (
    <>
      <Nav
        name={profile.name}
        resumeHref={profile.resumeHref}
        hasProjects={projects.length > 0}
      />
      <main className="flex-1">
        <Hero />
        <About />
        <Journey />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <Chat name={profile.name} />
    </>
  );
}
