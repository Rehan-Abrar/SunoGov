import InputPanel from "./components/InputPanel";
import ReasoningCard from "./components/ReasoningCard";
import SubmissionHub from "./components/SubmissionHub";
import ComplaintBox from "./components/ComplaintBox";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center">SunoGov</h1>
        <p className="text-center text-gray-600">
          AI-powered civic complaint navigator for Pakistan
        </p>
        <InputPanel />
        <ReasoningCard />
        <ComplaintBox />
        <SubmissionHub />
      </div>
    </main>
  );
}
