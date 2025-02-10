import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import adminApi from '../apis/admin';

const Modal = ({ trainer, onClose }) => {
  if (!trainer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Trainer Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Career</h3>
            <p>{trainer.career}</p>
          </div>
          <div>
            <h3 className="font-semibold">Certifications</h3>
            <ul className="list-disc pl-4">
              {trainer.certifications?.map((cert, index) => (
                <li key={index}>{cert.skills}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrainerList = () => {
  const [trainers, setTrainers] = useState({ content: [], totalPages: 0 });
  const [page, setPage] = useState(0);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTrainers();
  }, [page]);

  const fetchTrainers = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getTrainers(page);
      setTrainers(data);
    } catch (error) {
      console.error('Failed to fetch trainers:', error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md m-4 p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Trainer Management</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trainers.content.map((trainer) => (
              <tr key={trainer.id}>
                <td className="px-6 py-4 whitespace-nowrap">{trainer.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trainer.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trainer.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trainer.isAccess || 'Pending'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                    onClick={() => {
                      setSelectedTrainer(trainer);
                      setShowModal(true);
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal
          trainer={selectedTrainer}
          onClose={() => {
            setShowModal(false);
            setSelectedTrainer(null);
          }}
        />
      )}
      <div className="flex justify-center gap-2 mt-4">
        <button
          className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="py-1">
          Page {page + 1} of {trainers.totalPages}
        </span>
        <button
          className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
          onClick={() => setPage(p => p + 1)}
          disabled={page >= trainers.totalPages - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TrainerList;
