import { useGame, SET_SIZE } from "@/context/GameContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import TeamCrest from "@/components/TeamCrest";
import PlayerCard from "@/components/PlayerCard";


function formatPrice(lakhs: number): string {
  if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(2)} Cr`;
  return `₹${lakhs} L`;
}

export default function AuctionSideTabs() {
  const { state } = useGame();

  const totalSets = Math.ceil(state.playerPool.length / SET_SIZE);
  const currentSetIndex = Math.floor(state.currentPlayerIndex / SET_SIZE);

  // Only reveal current and past sets — upcoming sets stay hidden
  const sets = Array.from({ length: totalSets }, (_, i) => ({
    index: i,
    players: state.playerPool.slice(i * SET_SIZE, (i + 1) * SET_SIZE),
    locked: i > currentSetIndex,
  }));

  return (
    <Tabs defaultValue="sets" className="w-full">
      <TabsList className="tab-rail w-full flex">
        <TabsTrigger value="sets" className="tab-pill flex-1 text-xs">Sets</TabsTrigger>
        <TabsTrigger value="purse" className="tab-pill flex-1 text-xs">Purse</TabsTrigger>
        <TabsTrigger value="bought" className="tab-pill flex-1 text-xs">Bought</TabsTrigger>
        <TabsTrigger value="unsold" className="tab-pill flex-1 text-xs">
          Unsold{state.unsoldPlayers.length > 0 && ` (${state.unsoldPlayers.length})`}
        </TabsTrigger>

      </TabsList>

      {/* Sets Tab */}
      <TabsContent value="sets">
        <ScrollArea className="h-[350px]">
          <div className="space-y-3 pr-2">
            {sets.map((set) => {
              const isCurrent = set.index === currentSetIndex;
              const isPast = set.index < currentSetIndex;
              return (
                <div
                  key={set.index}
                  className={`rounded-lg p-3 border ${
                    isCurrent
                      ? "border-primary/50 bg-primary/5"
                      : isPast
                      ? "border-border/20 bg-secondary/20 opacity-70"
                      : "border-border/20 bg-secondary/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-display text-xs font-bold uppercase ${
                      isCurrent ? "text-primary" : "text-muted-foreground"
                    }`}>
                      Set {set.index + 1}
                      {isCurrent && " (Current)"}
                      {isPast && " ✓"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {set.players.length} players
                    </span>
                  </div>
                  {set.locked ? (
                    <div className="text-xs text-muted-foreground italic py-1">
                      🔒 Revealed when this set begins
                    </div>
                  ) : (
                  <div className="space-y-1.5">
                    {set.players.map((p) => {
                      const sold = state.soldPlayers.find((sp) => sp.player.id === p.id);
                      const isUnsold = state.unsoldPlayers.some((up) => up.id === p.id);
                      const isCurrentPlayer = state.playerPool[state.currentPlayerIndex]?.id === p.id;
                      return (
                        <PlayerCard
                          key={p.id}
                          player={p}
                          variant="compact"
                          animate={false}
                          selected={isCurrentPlayer}
                          outcome={sold ? "sold" : isUnsold ? "unsold" : null}
                          priceCaption={sold ? "Sold" : isUnsold ? "Unsold" : "Base"}
                          priceTone={sold ? "green" : isUnsold ? "red" : "gold"}
                          priceLabel={sold ? formatPrice(sold.price) : formatPrice(p.basePrice)}
                        />
                      );
                    })}
                  </div>

                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </TabsContent>

      {/* Purse Tab */}
      <TabsContent value="purse">
        <ScrollArea className="h-[350px]">
          <div className="space-y-2 pr-2">
            {Object.values(state.teamStates)
              .sort((a, b) => b.purseRemaining - a.purseRemaining)
              .map((ts) => {
                const totalPurse = ts.team.totalPurse - ts.team.purseSpentOnRetentions;
                const spent = totalPurse - ts.purseRemaining;
                const pct = totalPurse > 0 ? (ts.purseRemaining / totalPurse) * 100 : 0;
                return (
                  <div key={ts.team.id} className="bg-secondary/30 rounded-lg p-3 border border-border/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm" style={{ color: ts.team.colorHex }}>
                        <TeamCrest teamId={ts.team.id} shortName={ts.team.shortName} colorHex={ts.team.colorHex} size="sm" className="mr-1" />{ts.team.shortName}
                      </span>
                      <span className="text-primary font-bold text-sm">{formatPrice(ts.purseRemaining)}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: ts.team.colorHex,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Spent: {formatPrice(spent)}</span>
                      <span>Squad: {ts.squad.length + ts.team.retainedPlayers.length}/25</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </ScrollArea>
      </TabsContent>

      {/* Bought Players Tab */}
      <TabsContent value="bought">
        <ScrollArea className="h-[350px]">
          <div className="space-y-3 pr-2">
            {Object.values(state.teamStates).map((ts) => {
              const teamBought = state.soldPlayers.filter((sp) => sp.teamId === ts.team.id);
              if (teamBought.length === 0) return null;
              return (
                <div key={ts.team.id} className="bg-secondary/30 rounded-lg p-3 border border-border/20">
                  <div className="font-bold text-sm mb-2" style={{ color: ts.team.colorHex }}>
                    <TeamCrest teamId={ts.team.id} shortName={ts.team.shortName} colorHex={ts.team.colorHex} size="sm" className="mr-1" />{ts.team.shortName} ({teamBought.length})
                  </div>
                  <div className="space-y-1.5">
                    {teamBought.map((sp) => (
                      <PlayerCard
                        key={sp.player.id}
                        player={sp.player}
                        variant="compact"
                        animate={false}
                        outcome="sold"
                        priceCaption="Sold"
                        priceTone="green"
                        priceLabel={formatPrice(sp.price)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            {state.soldPlayers.length === 0 && (
              <p className="text-muted-foreground text-xs text-center py-4">No players bought yet</p>
            )}
          </div>
        </ScrollArea>
      </TabsContent>

      {/* Unsold Tab */}
      <TabsContent value="unsold">
        <ScrollArea className="h-[350px]">
          <div className="space-y-1.5 pr-2">
            {state.unsoldPlayers.map((p) => (
              <PlayerCard
                key={p.id}
                player={p}
                variant="compact"
                outcome="unsold"
                priceCaption="Unsold at"
                priceTone="red"
                priceLabel={formatPrice(p.basePrice)}
              />
            ))}

            {state.unsoldPlayers.length === 0 && (
              <p className="text-muted-foreground text-xs text-center py-4">No unsold players yet</p>
            )}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
