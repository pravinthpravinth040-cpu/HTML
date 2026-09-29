import { StudentProfile, CareerPath, Topic, ProjectProgress, StudySession, Project } from '../types';

export interface AIContext {
  studentProfile: StudentProfile | null;
  selectedCareer: CareerPath | null;
  completedTopics: Topic[];
  pendingTopics: Topic[];
  projects: Project[];
  projectProgress: ProjectProgress[];
  studySessions: StudySession[];
  currentStreak: number;
}

export const askAICareerAssistant = async (
  userMessage: string,
  context: AIContext,
  customApiKey?: string
): Promise<string> => {
  const apiKey =
    customApiKey ||
    import.meta.env.VITE_OPENAI_API_KEY ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    '';

  const {
    studentProfile,
    selectedCareer,
    completedTopics,
    pendingTopics,
    projects,
    projectProgress,
    studySessions,
    currentStreak,
  } = context;

  // Calculate actual numbers
  const completedTopicsCount = completedTopics.length;
  const pendingTopicsCount = pendingTopics.length;
  const totalTopicsCount = completedTopicsCount + pendingTopicsCount;
  const totalStudyMinutes = studySessions.reduce((sum, s) => sum + Math.round(s.durationSeconds / 60), 0);
  const completedProjects = projectProgress.filter(p => p.status === 'completed').length;

  const systemContextPrompt = `
You are the AI Career & Technical Mentor for CareerPath.
CRITICAL MANDATE: Use ONLY the student's real database facts below. Do NOT hallucinate fake progress, fake courses, or fake achievements.

Real Student Data:
- Name: ${studentProfile?.fullName || 'Student'}
- Selected Career: ${selectedCareer ? selectedCareer.title : 'None selected yet'}
- Target Career Category: ${selectedCareer?.category || 'N/A'}
- Degree / College: ${studentProfile?.degree || 'Not specified'} (${studentProfile?.college || 'Not specified'})
- Completed Topics: ${completedTopicsCount} / ${totalTopicsCount} (${completedTopics.map(t => t.name).join(', ') || 'None'})
- Pending Next Topics: ${pendingTopics.slice(0, 5).map(t => t.name).join(', ') || 'No published topics remaining'}
- Completed Projects: ${completedProjects} of ${projects.length}
- Total Study Time: ${Math.round(totalStudyMinutes / 60 * 10) / 10} hours (${totalStudyMinutes} minutes)
- Current Streak: ${currentStreak} days
- Daily Available Hours: ${studentProfile?.dailyAvailableHours || 2} hours/day
- Student GitHub: ${studentProfile?.githubUrl ? 'Configured' : 'Not added'}
- Student Resume: ${studentProfile?.resumeUrl ? 'Configured' : 'Not added'}

If the user asks about their progress, cite only these real numbers.
If the student asks what to study today and there are pending topics, suggest the next pending topic: "${pendingTopics[0]?.name || 'Check with admin for published topics'}".
If there are no topics published or no career selected, explain that they first need to choose a career or wait for the administrator to publish content.
`;

  // If OpenAI API key is present
  if (apiKey && apiKey.startsWith('sk-')) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemContextPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.6,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response generated.';
      }
    } catch (err) {
      console.warn('OpenAI API call failed, falling back to local contextual engine:', err);
    }
  }

  // Built-in intelligent contextual response engine (Works offline & with zero API key dependencies)
  const query = userMessage.toLowerCase().trim();

  if (!selectedCareer) {
    if (query.includes('what should i study') || query.includes('study plan') || query.includes('progress')) {
      return `Welcome ${studentProfile?.fullName || 'there'}! You haven't chosen a career path yet. \n\nPlease navigate to the **Choose Career** page from your dashboard to select a career path published by your administrator. Once selected, I will track your roadmap topics, study sessions, and projects in real time.`;
    }
  }

  if (query.includes('how much progress') || query.includes('my progress') || query.includes('stat')) {
    if (totalTopicsCount === 0 && studySessions.length === 0) {
      return `Here is your verified progress status:\n\n• **Career Goal:** ${selectedCareer ? selectedCareer.title : 'None selected'}\n• **Completed Topics:** 0 (No topics marked complete yet)\n• **Recorded Study Hours:** 0 hours\n• **Current Streak:** 0 days\n• **Completed Projects:** 0\n\nYou haven't recorded any study sessions or completed topics yet. Open your **Roadmap** to begin studying!`;
    }
    return `Here is your real-time verified progress report:\n\n• **Career Goal:** ${selectedCareer?.title}\n• **Topics Completed:** ${completedTopicsCount} out of ${totalTopicsCount} (${totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0}%)\n• **Total Study Time:** ${Math.round(totalStudyMinutes / 60 * 10) / 10} hours logged across ${studySessions.length} sessions\n• **Study Streak:** ${currentStreak} days active\n• **Projects Completed:** ${completedProjects} of ${projects.length}\n\nKeep logging your daily study sessions with the Study Timer to maintain your consistency streak!`;
  }

  if (query.includes('what should i study today') || query.includes('today') || query.includes('next topic')) {
    if (!selectedCareer) {
      return `You haven't selected a target career yet. Please go to the Career Selection page first.`;
    }
    if (pendingTopics.length === 0) {
      if (completedTopicsCount > 0) {
        return `Congratulations! You have completed all currently published topics in **${selectedCareer.title}**. You can work on assigned projects or check with your administrator for newly published modules.`;
      }
      return `No published topics have been added to **${selectedCareer.title}** yet by the administrator. Once the admin adds modules and topics, your daily study plan will appear here.`;
    }

    const nextTopic = pendingTopics[0];
    return `Based on your current progress in **${selectedCareer.title}**, here is your priority for today:\n\n📌 **Next Topic to Study:** **${nextTopic.name}**\n• Estimated duration: ${nextTopic.estimatedLearningTimeMinutes} minutes\n• Difficulty: ${nextTopic.difficulty}\n\n**Action Steps:**\n1. Open the Study Materials tab to review resources for "${nextTopic.name}".\n2. Start a 25-minute Pomodoro timer session to focus.\n3. Take notes and mark the topic as complete once understood.`;
  }

  if (query.includes('study plan') || query.includes('schedule') || query.includes('plan')) {
    const dailyHours = studentProfile?.dailyAvailableHours || 2;
    if (pendingTopics.length === 0) {
      return `Your daily study availability is set to **${dailyHours} hours/day**. However, there are no uncompleted topics currently published for your career. Ask your administrator to publish the next roadmap phases!`;
    }
    const upcoming = pendingTopics.slice(0, 3);
    return `Here is your customized study plan based on your available **${dailyHours} hours/day**:\n\n` +
      upcoming.map((t, idx) => `**Day ${idx + 1}: ${t.name}**\n• Target: ${t.estimatedLearningTimeMinutes} min study + practice\n• Difficulty: ${t.difficulty}`).join('\n\n') +
      `\n\n💡 *Tip: Remember to use the 25-min Pomodoro timer to maintain focus and build your study streak!*`;
  }

  if (query.includes('interview') || query.includes('interview question')) {
    const careerName = selectedCareer?.title || 'Software Engineering';
    return `Here are 4 targeted interview questions for **${careerName}**:\n\n` +
      `1. **System & Architecture:** How do you approach scaling an application when database queries become a bottleneck?\n` +
      `2. **Core Concepts:** Explain the difference between synchronous and asynchronous execution with a practical use case.\n` +
      `3. **Error Handling & Resilience:** How do you handle transient network failures in client-server communication?\n` +
      `4. **Practical Experience:** Tell me about a bug you encountered recently and walk me through your step-by-step debugging workflow.\n\n` +
      `Try writing out your answers in bullet points, then review with the project code you've written!`;
  }

  if (query.includes('project idea') || query.includes('project')) {
    const career = selectedCareer?.title || 'Full Stack Development';
    return `Here is a production-level project idea tailored for **${career}**:\n\n` +
      `🚀 **Project Name:** Collaborative Real-Time Task & Workflow Engine\n` +
      `• **Key Features:** User authentication, role-based permissions, Kanban board with live updates, file attachments, and activity history audit log.\n` +
      `• **Tech Stack:** React, TypeScript, Tailwind CSS, PostgreSQL / Supabase, and WebSockets.\n` +
      `• **Portfolio Value:** Demonstrates relational data modeling, asynchronous state management, and real-time event handling that employers look for.`;
  }

  if (query.includes('javascript') || query.includes('explain')) {
    return `**Core Technical Breakdown:**\n\nJavaScript is a high-level, single-threaded, event-driven programming language. Its runtime relies on the **Event Loop**, call stack, and task queues to handle asynchronous operations without blocking the main execution thread.\n\nKey pillars to master:\n1. **Execution Context & Closures:** How functions retain access to their lexical scope.\n2. **Promises & Async/Await:** Modern syntactic sugar over asynchronous microtask queues.\n3. **Prototypes & ES6 Classes:** Object inheritance mechanism in JS engines like V8.`;
  }

  if (query.includes('error') || query.includes('bug')) {
    return `To help you diagnose the error effectively, please paste:\n1. The exact error message and stack trace.\n2. The code snippet where the error is triggered.\n3. What behavior you expected vs what actually happened.\n\nI will analyze the root cause and provide the direct fix!`;
  }

  // General helpful response
  return `I am here to guide your career preparation for **${selectedCareer?.title || 'your chosen career'}**!\n\n` +
    `You can ask me to:\n` +
    `• *"What should I study today?"* (identifies your next pending topic)\n` +
    `• *"How much progress have I made?"* (breaks down real database records)\n` +
    `• *"Create a study plan"* (generates daily targets)\n` +
    `• *"Prepare interview questions"* (tests your domain knowledge)\n` +
    `• *"Explain [any technical topic or error]"*`;
};
