import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BookOpen,
  Users,
  GraduationCap,
  Settings,
  LogOut,
  Edit,
  MapPin,
  School,
  UserCheck,
  BarChart3,
  TrendingUp,
  Activity,
  Plus,
  Search,
  Menu,
  X,
  Bell,
  Home,
  FileText,
  ChevronRight,
  Sparkles,
  Target,
  Shield,
  ShieldHalf,
  Database,
} from "lucide-react";
import { apiService } from "../../../services/apiServices";

const OverViewPage = ({ user }) => {
  const [classStatus, setClassStatus] = useState("");

  const StudentStats = async () => {
    try {
      const data = await apiService.getAssignedClassesStudent(user?._id);
      console.log("Student stats:", data);
      setClassStatus(data);
    } catch (err) {
      console.error("Failed to fetch teacher stats", err.message);
    }
  };

  useEffect(() => {
    if (user?.role === "student" && user?._id) {
      StudentStats();
    }
  }, [user?._id, user?.role]);
  const [count, setCount] = React.useState(0);
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 to-yellow-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 tracking-tight">
                Welcome back, {user?.username}! 👨🏿‍🎓
              </h1>
              <p className="text-orange-100 text-lg font-medium">
                Manage your with confidence
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <ShieldHalf className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>
      {/* stats section  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-semibold tracking-wide">
                  Total Assignments
                </p>
                <p className="text-3xl font-bold text-green-700 tracking-tight">
                  {classStatus?.totalAssignments || 0}
                </p>
                <p className="text-green-500 text-xs mt-1 font-medium">
                  Active faculty
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-green-200/50 rounded-full"></div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-semibold tracking-wide">
                  Total Classes
                </p>
                <p className="text-3xl font-bold text-purple-700 tracking-tight">
                     {classStatus?.totalClasses || 0}
                </p>
                <p className="text-purple-500 text-xs mt-1 font-medium">
                  Active classes
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-purple-200/50 rounded-full"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverViewPage;
