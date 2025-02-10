import { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSendSupport } from '@/query/email.queries';
import { UserContext } from '@/context';
import { HelpIcon } from "@/utils/icons/icons";

const HelpBox = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useContext(UserContext);
  
  const { mutate: sendSupport, isPending } = useSendSupport();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendSupport({ subject, description, email: user?.email });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center items-center mb-12">
         <div className='flex items-center justify-center gap-6 mb-4'>
         <div className="flex justify-center">
            <HelpIcon />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Need Help?
          </h1>
         </div>
          <p className="text-zinc-400">
            Our support team is here to help. Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-purple-900/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-purple-400">Email</label>
              <Input
                type="email"
                value={user?.email}
                disabled
                className="bg-zinc-800/50 border-purple-900/50 text-zinc-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-purple-400">Subject</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-zinc-800/50 border-purple-900/50 focus:border-purple-500 focus:ring-purple-500"
                placeholder="Brief description of your issue"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-purple-400">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-zinc-800/50 border-purple-900/50 focus:border-purple-500 focus:ring-purple-500"
                placeholder="Please provide detailed information about your issue"
                rows={6}
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={isPending || !subject.trim() || !description.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 shadow-[0_0_10px_rgba(147,51,234,0.3)]"
            >
              {isPending ? 'Sending...' : 'Submit Support Request'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpBox;
