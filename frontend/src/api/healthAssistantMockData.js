// src/api/healthAssistantMockData.js

export const healthHistoryData = [
  {
    id: 1,
    title: "Daisy's Limp",
    date: "Oct 12",
    type: "AI Check",
    icon: "monitor_heart",
    active: true,
  },
  {
    id: 2,
    title: "Luna's Sneezing",
    date: "Sep 5",
    type: "Vet Visit",
    icon: "stethoscope",
    active: false,
  },
  {
    id: 3,
    title: "Annual Boosters",
    date: "Aug 20",
    type: "Routine",
    icon: "vaccines",
    active: false,
  },
];

export const petsData = [
  {
    id: "daisy",
    name: "Daisy",
    breed: "Beagle",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADpqh9jDfM4qROiuI_4XOOOvyuXNW1hQKs1NE_6Cj2MjlOeIhqiymS4uNFcC8Tz8XNfx7OrqW9YX5jb0uEdc7c8mdXsszquqo2q96HiUmQFqocZsGcbX28kwrY7VtriggFGEiNMTDGOiwLP4A_vDkXlmYGUx_eVml9OL8YpbTiiJbesQFX8h9sTKLV2sdPzk7aheB-qqKunL-wlksI4gbJydvRqmDmcAjBRusPY2WVZIjjCTQKCq02wpvmRJylhFUW0XRTw6shDAGB",
    active: true,
  },
  {
    id: "luna",
    name: "Luna",
    breed: "Mixed Cat",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeBSjmhkv8hiwITlEir6Do-EypzvtsWeZQ-X8rzOs7mPZWMRhiVXBmgnPYatKe9V6oTdVNl4JPtqpk3aNRqMbCVQBR5tJCHLfdDYOVll3e2M0W5IFrIE-pwwOHLGhsBKgMh2NVQ9U0cENLkW8BfyBFsVinMAedS_1xvAGpBojadZjX9PjOkJT2RxIKGcYgBtuu0pV1_oap7wPzoEdBOyVPcR9gvBgjDsVhAJLu2rFJIAL0Qou1pCVFCR6fa6nbFzFymBsx_DvMOW8A",
    active: false,
  },
];

export const assistantData = {
  name: "Health Assistant",
  status: "Online",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBU1JFyDRfYvkIzsJB-aN_tsDdyNg1jThMylU8kNsUpT4NGDXks0VGzrS3AOdQvfXT7clWkGPF6awqdXNuZsSP_0LGUmeD1uCvX3aXAFN1I6kMGcFiZwpAK8hAOcS8F8E8KNlELQectO6zGznbn0PjdfrvRBB_GjvDr6oRDH89nLr3fVTzAsTXiQGMoskQGbMwE0C33cztYeqCJyqC6IpFL_KmkMhT6PsBFePJwHwYIQzpqfwxkbhNW5zf3n3qzN89uLRwxp7lRPB4U",
};

// chat message shape: { id, sender: 'ai' | 'user', type: 'text' | 'typing', text }
export const chatMessagesData = [
  {
    id: 1,
    sender: "ai",
    type: "text",
    text: "Hi! I'm here to help you check on Daisy. Can you describe what you've noticed about her limp?",
  },
  {
    id: 2,
    sender: "user",
    type: "text",
    text: "She started limping on her back right leg this morning after her walk. She still eats fine and seems happy otherwise.",
  },
];
