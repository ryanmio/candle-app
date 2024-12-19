-- Create the candles table
CREATE TABLE candles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  color TEXT NOT NULL,
  scents JSONB NOT NULL,
  image_url TEXT,
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the feedback table
CREATE TABLE feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  candle_id UUID REFERENCES candles(id),
  scent_feedback JSONB NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_candles_id ON candles(id);
CREATE INDEX idx_feedback_candle_id ON feedback(candle_id);

