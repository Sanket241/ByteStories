import CallToAction from '../Component/CallToAction';

export default function Projects() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8 text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Projects
        </h1>
        <p className="text-md text-gray-600 mb-6">
          Build fun and engaging projects while learning HTML, CSS, and JavaScript!
        </p>
        <CallToAction />
      </div>
     
    </div>
  );
}
