import { useEffect, useRef } from "react";
import { jsPDF } from "jspdf";

export default function ParkingTicket({ ticket, parking, onClose }) {
  const ticketRef = useRef(null);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const ticketElement = ticketRef.current;

    // Add title
    doc.setFontSize(20);
    doc.text("Parking Ticket", 105, 20, { align: "center" });

    // Add ticket details
    doc.setFontSize(12);
    doc.text(`Ticket Code: ${ticket.ticketCode}`, 20, 40);
    doc.text(`Plate Number: ${ticket.plateNumber}`, 20, 50);
    doc.text(
      `Entry Time: ${new Date(ticket.entryTime).toLocaleString()}`,
      20,
      60
    );
    doc.text(`Parking Lot: ${parking.name}`, 20, 70);
    doc.text(`Location: ${parking.location}`, 20, 80);
    doc.text(`Fee per Hour: $${parking.feePerHour}`, 20, 90);

    // Add instructions
    doc.setFontSize(10);
    doc.text("Please keep this ticket for exit", 105, 120, { align: "center" });
    doc.text("Thank you for using our parking service!", 105, 130, {
      align: "center",
    });

    // Save the PDF
    doc.save(`parking-ticket-${ticket.ticketCode}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full"
        ref={ticketRef}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Parking Ticket
          </h2>
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg bg-gray-50">
            <p className="text-lg font-semibold mb-3 text-blue-600">
              Ticket Code: {ticket.ticketCode}
            </p>
            <div className="space-y-2 text-gray-700">
              <p className="flex justify-between">
                <span className="font-medium">Plate Number:</span>
                <span>{ticket.plateNumber}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Entry Time:</span>
                <span>{new Date(ticket.entryTime).toLocaleString()}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Parking Lot:</span>
                <span>{parking.name}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Location:</span>
                <span>{parking.location}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Fee per Hour:</span>
                <span>${parking.feePerHour}</span>
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600 italic">
            Please keep this ticket for exit
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button
            onClick={downloadPDF}
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
