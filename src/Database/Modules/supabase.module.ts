import { Global, Module } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase URL and Key must be provided in environment variables.',
  );
}

export const Supabase = createClient(supabaseUrl, supabaseKey);

@Global()
@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useValue: Supabase,
    },
  ],
  exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule {}
