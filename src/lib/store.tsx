"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  RWUnit,
  RTUnit,
  Family,
  Resident,
  LetterRequest,
  Invoice,
  CashTransaction,
  Complaint,
  Facility,
  FacilityBooking,
  UMKMItem,
  Article,
  UserRole,
} from "@/types";
import {
  initialRW,
  initialRTs,
  initialFamilies,
  initialResidents,
  initialLetterRequests,
  initialInvoices,
  initialCashTransactions,
  initialComplaints,
  initialFacilities,
  initialFacilityBookings,
  initialUMKMs,
  initialArticles,
} from "@/data/mockData";
import { generateRandomCode } from "./utils";

interface AppContextType {
  // Active Role for Demo
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeRTId: string;
  setActiveRTId: (rtId: string) => void;

  // Master Data
  rw: RWUnit;
  rts: RTUnit[];
  families: Family[];
  residents: Resident[];
  
  // Transactions & Workflows
  letterRequests: LetterRequest[];
  invoices: Invoice[];
  cashTransactions: CashTransaction[];
  complaints: Complaint[];
  facilities: Facility[];
  facilityBookings: FacilityBooking[];
  umkms: UMKMItem[];
  articles: Article[];

  // Mutators
  addLetterRequest: (data: Omit<LetterRequest, "id" | "trackingCode" | "status" | "submittedAt" | "verificationToken">) => LetterRequest;
  approveLetterRT: (id: string, approverName: string, notes?: string) => void;
  approveLetterRW: (id: string, approverName: string, officialNumber: string) => void;
  rejectLetter: (id: string, reason: string) => void;

  payInvoice: (invoiceId: string, method: 'QRIS' | 'TRANSFER_BANK' | 'TUNAI', proofUrl?: string) => void;
  verifyInvoice: (invoiceId: string, verifierName: string) => void;

  addCashTransaction: (data: Omit<CashTransaction, "id" | "transactionNumber" | "balanceAfter">) => void;
  
  addComplaint: (data: Omit<Complaint, "id" | "ticketNumber" | "status" | "submittedAt">) => Complaint;
  updateComplaintStatus: (id: string, status: Complaint['status'], assignedTo?: string, notes?: string, photoUrl?: string) => void;

  addFacilityBooking: (data: Omit<FacilityBooking, "id" | "status" | "createdAt">) => FacilityBooking;
  updateBookingStatus: (id: string, status: 'DISETUJUI' | 'DITOLAK') => void;

  addResident: (data: Omit<Resident, "id" | "createdAt">) => Resident;
  addFamily: (data: Omit<Family, "id" | "createdAt" | "residentCount">) => Family;
  
  addUMKM: (data: Omit<UMKMItem, "id">) => void;
  addArticle: (data: Omit<Article, "id" | "publishedAt" | "slug">) => void;
  
  resetToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "rw_digital_db_v3_padasuka14_official";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("KETUA_RW");
  const [activeRTId, setActiveRTId] = useState<string>("rt-01");

  // State Data
  const [rw, setRw] = useState<RWUnit>(initialRW);
  const [rts, setRts] = useState<RTUnit[]>(initialRTs);
  const [families, setFamilies] = useState<Family[]>(initialFamilies);
  const [residents, setResidents] = useState<Resident[]>(initialResidents);
  const [letterRequests, setLetterRequests] = useState<LetterRequest[]>(initialLetterRequests);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>(initialCashTransactions);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [facilityBookings, setFacilityBookings] = useState<FacilityBooking[]>(initialFacilityBookings);
  const [umkms, setUmkms] = useState<UMKMItem[]>(initialUMKMs);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.rw) setRw(parsed.rw);
        if (parsed.rts) setRts(parsed.rts);
        if (parsed.families) setFamilies(parsed.families);
        if (parsed.residents) setResidents(parsed.residents);
        if (parsed.letterRequests) setLetterRequests(parsed.letterRequests);
        if (parsed.invoices) setInvoices(parsed.invoices);
        if (parsed.cashTransactions) setCashTransactions(parsed.cashTransactions);
        if (parsed.complaints) setComplaints(parsed.complaints);
        if (parsed.facilities) setFacilities(parsed.facilities);
        if (parsed.facilityBookings) setFacilityBookings(parsed.facilityBookings);
        if (parsed.umkms) setUmkms(parsed.umkms);
        if (parsed.articles) setArticles(parsed.articles);
      }
    } catch (e) {
      console.warn("Failed to load local storage state:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToSave = {
        rw,
        rts,
        families,
        residents,
        letterRequests,
        invoices,
        cashTransactions,
        complaints,
        facilities,
        facilityBookings,
        umkms,
        articles,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn("Failed to save local storage state:", e);
    }
  }, [
    isLoaded,
    rw,
    rts,
    families,
    residents,
    letterRequests,
    invoices,
    cashTransactions,
    complaints,
    facilities,
    facilityBookings,
    umkms,
    articles,
  ]);

  // Letter Request Actions
  const addLetterRequest = (
    data: Omit<LetterRequest, "id" | "trackingCode" | "status" | "submittedAt" | "verificationToken">
  ): LetterRequest => {
    const newLetter: LetterRequest = {
      ...data,
      id: `let-${Date.now()}`,
      trackingCode: generateRandomCode("SRT"),
      status: "MENUNGGU_RT",
      submittedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      verificationToken: `vtok-${Math.random().toString(36).substring(2, 12)}`,
    };
    setLetterRequests((prev) => [newLetter, ...prev]);
    return newLetter;
  };

  const approveLetterRT = (id: string, approverName: string, notes?: string) => {
    setLetterRequests((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "MENUNGGU_RW",
              rtApprovedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
              rtApprovedBy: approverName,
              rtNotes: notes || item.rtNotes,
            }
          : item
      )
    );
  };

  const approveLetterRW = (id: string, approverName: string, officialNumber: string) => {
    setLetterRequests((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "DISETUJUI",
              rwApprovedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
              rwApprovedBy: approverName,
              letterOfficialNumber: officialNumber,
            }
          : item
      )
    );
  };

  const rejectLetter = (id: string, reason: string) => {
    setLetterRequests((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "DITOLAK",
              rejectionReason: reason,
            }
          : item
      )
    );
  };

  // Invoice & Payment Actions
  const payInvoice = (
    invoiceId: string,
    method: 'QRIS' | 'TRANSFER_BANK' | 'TUNAI',
    proofUrl?: string
  ) => {
    const isAutoVerified = method === "QRIS";
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const updated: Invoice = {
            ...inv,
            paymentMethod: method,
            paymentProofUrl: proofUrl,
            paidAt: new Date().toISOString().replace("T", " ").slice(0, 16),
            status: isAutoVerified ? "LUNAS" : "MENUNGGU_VERIFIKASI",
            verifiedBy: isAutoVerified ? "Sistem Otomatis (QRIS)" : undefined,
            verifiedAt: isAutoVerified ? new Date().toISOString().replace("T", " ").slice(0, 16) : undefined,
          };
          return updated;
        }
        return inv;
      })
    );

    if (isAutoVerified) {
      const inv = invoices.find((i) => i.id === invoiceId);
      if (inv) {
        addCashTransaction({
          date: new Date().toISOString().slice(0, 10),
          type: "MASUK",
          category: "IURAN_WARGA",
          title: `Pembayaran Iuran ${inv.headOfFamilyName} (${inv.houseNumber})`,
          description: `Iuran periode ${inv.billingPeriod} via QRIS`,
          amount: inv.totalAmount,
          recordedBy: "Sistem Otomatis",
        });
      }
    }
  };

  const verifyInvoice = (invoiceId: string, verifierName: string) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;

    setInvoices((prev) =>
      prev.map((item) =>
        item.id === invoiceId
          ? {
              ...item,
              status: "LUNAS",
              verifiedBy: verifierName,
              verifiedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
            }
          : item
      )
    );

    addCashTransaction({
      date: new Date().toISOString().slice(0, 10),
      type: "MASUK",
      category: "IURAN_WARGA",
      title: `Pembayaran Iuran ${inv.headOfFamilyName} (${inv.houseNumber})`,
      description: `Iuran periode ${inv.billingPeriod} diverifikasi oleh ${verifierName}`,
      amount: inv.totalAmount,
      recordedBy: verifierName,
    });
  };

  // Cash Transactions
  const addCashTransaction = (
    data: Omit<CashTransaction, "id" | "transactionNumber" | "balanceAfter">
  ) => {
    const currentBalance =
      cashTransactions.length > 0 ? cashTransactions[cashTransactions.length - 1].balanceAfter : 0;
    
    const newBalance =
      data.type === "MASUK"
        ? currentBalance + data.amount
        : currentBalance - data.amount;

    const newTx: CashTransaction = {
      ...data,
      id: `tx-${Date.now()}`,
      transactionNumber: generateRandomCode("KAS"),
      balanceAfter: newBalance,
    };

    setCashTransactions((prev) => [...prev, newTx]);
  };

  // Complaints
  const addComplaint = (
    data: Omit<Complaint, "id" | "ticketNumber" | "status" | "submittedAt">
  ): Complaint => {
    const newComplaint: Complaint = {
      ...data,
      id: `cmp-${Date.now()}`,
      ticketNumber: generateRandomCode("ADU"),
      status: "TERKIRIM",
      submittedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    return newComplaint;
  };

  const updateComplaintStatus = (
    id: string,
    status: Complaint["status"],
    assignedTo?: string,
    notes?: string,
    photoUrl?: string
  ) => {
    setComplaints((prev) =>
      prev.map((cmp) =>
        cmp.id === id
          ? {
              ...cmp,
              status,
              assignedTo: assignedTo || cmp.assignedTo,
              resolutionNotes: notes || cmp.resolutionNotes,
              resolutionPhotoUrl: photoUrl || cmp.resolutionPhotoUrl,
              resolvedAt: status === "SELESAI" ? new Date().toISOString().replace("T", " ").slice(0, 16) : cmp.resolvedAt,
            }
          : cmp
      )
    );
  };

  // Facilities
  const addFacilityBooking = (
    data: Omit<FacilityBooking, "id" | "status" | "createdAt">
  ): FacilityBooking => {
    const newBooking: FacilityBooking = {
      ...data,
      id: `bk-${Date.now()}`,
      status: "PENDING",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setFacilityBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: "DISETUJUI" | "DITOLAK") => {
    setFacilityBookings((prev) =>
      prev.map((bk) => (bk.id === id ? { ...bk, status } : bk))
    );
  };

  // Residents & Families
  const addResident = (data: Omit<Resident, "id" | "createdAt">): Resident => {
    const newResident: Resident = {
      ...data,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setResidents((prev) => [...prev, newResident]);
    
    // update family count
    setFamilies((prev) =>
      prev.map((f) =>
        f.id === data.familyId ? { ...f, residentCount: f.residentCount + 1 } : f
      )
    );
    return newResident;
  };

  const addFamily = (data: Omit<Family, "id" | "createdAt" | "residentCount">): Family => {
    const newFamily: Family = {
      ...data,
      id: `fam-${Date.now()}`,
      residentCount: 1,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setFamilies((prev) => [...prev, newFamily]);
    return newFamily;
  };

  // UMKM & Articles
  const addUMKM = (data: Omit<UMKMItem, "id">) => {
    const item: UMKMItem = { ...data, id: `umkm-${Date.now()}` };
    setUmkms((prev) => [item, ...prev]);
  };

  const addArticle = (data: Omit<Article, "id" | "publishedAt" | "slug">) => {
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const item: Article = {
      ...data,
      id: `art-${Date.now()}`,
      slug: `${slug}-${Date.now()}`,
      publishedAt: new Date().toISOString().slice(0, 10),
    };
    setArticles((prev) => [item, ...prev]);
  };

  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRw(initialRW);
    setRts(initialRTs);
    setFamilies(initialFamilies);
    setResidents(initialResidents);
    setLetterRequests(initialLetterRequests);
    setInvoices(initialInvoices);
    setCashTransactions(initialCashTransactions);
    setComplaints(initialComplaints);
    setFacilities(initialFacilities);
    setFacilityBookings(initialFacilityBookings);
    setUmkms(initialUMKMs);
    setArticles(initialArticles);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeRTId,
        setActiveRTId,
        rw,
        rts,
        families,
        residents,
        letterRequests,
        invoices,
        cashTransactions,
        complaints,
        facilities,
        facilityBookings,
        umkms,
        articles,
        addLetterRequest,
        approveLetterRT,
        approveLetterRW,
        rejectLetter,
        payInvoice,
        verifyInvoice,
        addCashTransaction,
        addComplaint,
        updateComplaintStatus,
        addFacilityBooking,
        updateBookingStatus,
        addResident,
        addFamily,
        addUMKM,
        addArticle,
        resetToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
