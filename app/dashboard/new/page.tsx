import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createSpot } from '@/data/actions/spot';
import { SpotForm } from '../_components/SpotForm';

export default function NewSpotPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Add New Spot</CardTitle>
      </CardHeader>
      <CardContent>
        <SpotForm
          action={createSpot}
          defaultValues={{ category: '', content: '', description: '', name: '', neighborhood: '', published: false }}
          submitLabel="Add Spot"
          successMessage="Spot added successfully"
          redirectTo="/dashboard"
          cancelHref="/dashboard"
        />
      </CardContent>
    </Card>
  );
}
