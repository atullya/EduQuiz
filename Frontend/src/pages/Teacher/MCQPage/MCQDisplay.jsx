"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download } from "lucide-react"
import MCQCard from "./MCQCard"

const MCQDisplay = ({ mcqs, onExport, isExporting }) => {
  if (mcqs.length === 0) return null

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
          <CheckCircle className="mr-3 h-6 w-6 text-green-600" />
          Generated MCQs
        </CardTitle>
        <div className="flex items-center justify-center space-x-4 mt-4">
          <Badge className="bg-green-100 text-green-800 px-3 py-1">{mcqs.length} Questions Generated</Badge>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-300 text-blue-600 bg-transparent"
            onClick={onExport}
            disabled={isExporting || mcqs.length === 0}
          >
            {isExporting ? (
              "Exporting..."
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Export MCQs
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {mcqs.map((mcq, index) => (
          <MCQCard key={mcq.id} mcq={mcq} index={index} />
        ))}
      </CardContent>
    </Card>
  )
}

export default MCQDisplay
