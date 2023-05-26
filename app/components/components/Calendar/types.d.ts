type CalendarProps = {
  events: [];
  openModal: (action: { type: string; content: {}, padding: string }) => void;
  defaultView: defaultView;
  updateViewParams: setSearchParams;
  CTA: React.ReactNode;
};

type defaultView = 'month' | 'week' | 'day';