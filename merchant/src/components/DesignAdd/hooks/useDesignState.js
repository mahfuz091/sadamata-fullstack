import { useState } from "react";

export function useDesignState() {
  const [designImage, setDesignImage] = useState(null);
  const [designBack, setDesignBack] = useState(null);

  const [positions, setPositions] = useState({
    FRONT: {},
    BACK: {},
  });

  return {
    designImage,
    setDesignImage,
    designBack,
    setDesignBack,
    positions,
    setPositions,
  };
}
