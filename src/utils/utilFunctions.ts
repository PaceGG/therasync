const formatTime = (date: Date | null) => {
  return date
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--:--";
};
export default formatTime;
