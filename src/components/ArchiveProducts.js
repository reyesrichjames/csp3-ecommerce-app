import { Button } from "react-bootstrap";
import { Notyf } from 'notyf';

export default function ArchiveProduct({ productId, isActive, fetchData }) {
  const notyf = new Notyf();

  const archiveToggle = () => {
    const route = isActive ? "archive" : "activate";

    fetch(`http://localhost:4000/courses/${courseId}/${route}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        notyf.success(data.message);
        fetchData();
      } else {
        notyf.error(data.message || "Operation failed");
      }
    })
    .catch(() => {
      notyf.error("An error occurred.");
    });
  };

  return (
    <Button 
      variant={isActive ? "danger" : "success"} 
      size="sm" 
      onClick={archiveToggle}
    >
      {isActive ? "Archive" : "Activate"}
    </Button>
  );
}