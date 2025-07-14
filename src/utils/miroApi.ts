import { Template } from "../types";

const MIRO_API_BASE_URL = "https://api.miro.com/v2";

interface MiroBoard {
  id: string;
  name: string;
  viewLink: string;
}

interface MiroFrame {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface MiroStickyNote {
  id: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style?: {
    fillColor?: string;
    textAlign?: string;
    fontSize?: number;
  };
}

export const createMiroBoard = async (token: string, boardName: string): Promise<MiroBoard> => {
  const response = await fetch(`${MIRO_API_BASE_URL}/boards`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: boardName,
      sharingPolicy: {
        access: "private",
        teamAccess: "private",
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create board: ${response.status} ${response.statusText} - ${errorData.message}`);
  }

  return response.json();
};

export const createMiroFrame = async (token: string, boardId: string, frameData: any): Promise<MiroFrame> => {
  const response = await fetch(`${MIRO_API_BASE_URL}/boards/${boardId}/frames`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(frameData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create frame: ${response.status} ${response.statusText} - ${errorData.message}`);
  }

  return response.json();
};

export const createMiroStickyNote = async (token: string, boardId: string, stickyNoteData: any): Promise<MiroStickyNote> => {
  const response = await fetch(`${MIRO_API_BASE_URL}/boards/${boardId}/sticky_notes`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stickyNoteData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create sticky note: ${response.status} ${response.statusText} - ${errorData.message}`);
  }

  return response.json();
};

// Function to create the full board from a template
export const createBoardFromTemplate = async (token: string, template: Template) => {
  const board = await createMiroBoard(token, template.title);

  // For simplicity, let's assume a basic layout for frames and sticky notes
  // In a real application, you'd need more sophisticated layout logic
  let currentY = 0;

  for (const frame of template.structure.frames) {
    const createdFrame = await createMiroFrame(token, board.id, {
      data: {
        title: frame.name,
        shape: "rectangle",
      },
      position: {
        x: 0,
        y: currentY,
      },
      geometry: {
        width: 800,
        height: 300,
      },
    });

    currentY += 350; // Move down for the next frame

    let elementY = 50;
    for (const element of frame.elements) {
      await createMiroStickyNote(token, board.id, {
        data: {
          content: element,
        },
        position: {
          x: createdFrame.x + 50,
          y: createdFrame.y + elementY,
        },
        style: {
          fillColor: "#ffe066", // Yellow sticky note
        },
      });
      elementY += 50;
    }
  }

  return board;
};


